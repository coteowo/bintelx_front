// src/apps/mailbox/folders/index.js
import { getCurrentDebugProfile } from '../_debug/debug.js';

export const sidebarOptions = [
  { name: 'Bandeja', icon: '📥', categoryFilter: 'inbox' },
  { name: 'Enviados', icon: '📤', categoryFilter: 'sent' },
  { name: 'Dashboard', icon: '📊' },
  { name: 'Estadísticas', icon: '📈' },
  { name: 'Ayuda', icon: '❓' },
  { name: 'Nuevo', icon: '✉️', isSendButton: true },
  { name: 'Debug', icon: '🐞', isDebugButton: true },
];

let categoriaActiva = null;

export function renderFolders(container, onFolderSelect) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Correos';
  title.className = 'folders-title';
  container.appendChild(title);

  sidebarOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-folder flex items-center gap-2 w-full';
    btn.innerHTML = `<span>${opt.icon}</span><span>${opt.name}</span>`;

    btn.addEventListener('click', async () => {
      // ⚡ Obtenemos el perfil activo en el momento del click
      const perfilActivo = getCurrentDebugProfile();
      if (!perfilActivo || !perfilActivo.email) {
        console.error('[FOLDERS] No se pudo obtener perfilActivo correctamente');
        return;
      }

      // Botón de enviar
      if (opt.isSendButton) {
        onFolderSelect && onFolderSelect('send');
        return;
      }

      // Botón debug
      if (opt.isDebugButton) {
        onFolderSelect && onFolderSelect('debug');
        return;
      }

      // Marcar como activo
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      categoriaActiva = opt.categoryFilter || null;

      let mails = [];
      try {
        const res = await fetch('http://localhost:3001/api/messages');
        if (!res.ok) throw new Error('Error al cargar los mensajes');
        const allMails = await res.json();

        if (categoriaActiva === 'sent') {
          // Filtrar solo los enviados por el perfil activo
          mails = allMails.filter(mail => mail.sender === perfilActivo.email);
        } else if (categoriaActiva === 'inbox') {
          // Filtrar solo los recibidos por el perfil activo
          mails = allMails.filter(mail => mail.recipient === perfilActivo.email);
        } else {
          mails = allMails;
        }

        console.log(`[FOLDERS] ${categoriaActiva || 'todos'} cargados para ${perfilActivo.email}:`, mails.length);
      } catch (err) {
        console.error('[FOLDERS] Error al cargar mensajes:', err);
      }

      onFolderSelect && onFolderSelect(categoriaActiva, mails);
    });

    container.appendChild(btn);
  });

  // Auto-click en el primer botón con categoría (ej: Bandeja)
  const firstFilterBtn = [...container.querySelectorAll('button')]
    .find(btn =>
      sidebarOptions.find(opt => opt.name === btn.textContent.trim() && opt.categoryFilter)
    );
  if (firstFilterBtn) firstFilterBtn.click();
}
