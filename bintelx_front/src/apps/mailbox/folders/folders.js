import { renderMessageList } from '../messages/messages.js';
import { renderPreview } from '../preview/preview.js';
import { renderDetails } from '../details/details.js';
import initMessageForm from '../details/message-form.js';
import { initDebugPanel, getCurrentDebugProfile } from '../_debug/debug.js';

export const sidebarOptions = [
  { name: 'Bandeja', icon: '📥', categoryFilter: 'inbox' },
  { name: 'Enviados', icon: '📤', categoryFilter: 'sent' },
  { name: 'Dashboard', icon: '📊' },
  { name: 'Estadísticas', icon: '📈' },
  { name: 'Ayuda', icon: '❓' },
  { name: 'Enviar correo', icon: '✉️', isSendButton: true },
  { name: 'Debug', icon: '🐞', isDebugButton: true },
];

// Perfil activo global (inicializado con el perfil por defecto del debug)
let perfilActivo = getCurrentDebugProfile();
let categoriaActiva = null; // Guarda carpeta/categoría activa para refrescar

export function renderFolders(container) {
  container.innerHTML = '';

  sidebarOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-folder flex items-center gap-2 w-full';
    btn.innerHTML = `<span>${opt.icon}</span><span>${opt.name}</span>`;

    btn.addEventListener('click', () => {
      if (opt.isSendButton) {
        abrirFormularioEnviarCorreo();
        return;
      }

      if (opt.isDebugButton) {
        mostrarPanelDebug();
        return;
      }

      // Marcar activo
      const buttons = container.querySelectorAll('button');
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      console.log(`Carpeta seleccionada: ${opt.name}`);

      if (opt.categoryFilter) {
        categoriaActiva = opt.categoryFilter;
        renderMessagesWithPreview(opt.categoryFilter);
      } else {
        categoriaActiva = null;
      }
    });

    container.appendChild(btn);
  });

  // Click al primer botón con filtro para cargar mensajes
  const firstFilterBtn = [...container.querySelectorAll('button')]
    .find(btn =>
      btn.classList.contains('btn-folder') &&
      sidebarOptions.find(opt => opt.name === btn.textContent.trim() && opt.categoryFilter)
    );
  if (firstFilterBtn) firstFilterBtn.click();
}

function renderMessagesWithPreview(category) {
  const messageListContainer = document.getElementById('mailbox-message-list');
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');

  // Delegamos el filtrado a messages.js
  renderMessageList(
    messageListContainer,
    (id) => {
      renderPreview(previewContainer, id);
      renderDetails(detailsContainer, id);
      initMessageForm(detailsContainer);
    },
    category,     // Filtro: 'inbox', 'sent', etc.
    perfilActivo  // Perfil actual
  );
}

function abrirFormularioEnviarCorreo() {
  const detailsContainer = document.getElementById('mailbox-details');
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
    <form id="form-enviar" class="p-4">
      <label>Para: <input name="to" type="email" required></label><br>
      <label>Asunto: <input name="subject" type="text" required></label><br>
      <label>Mensaje:<br><textarea name="body" rows="5" required></textarea></label><br>
      <button type="submit" class="btn-folder">Enviar</button>
    </form>
  `;

  import('../messages/message-form.js').then(({ setupFormEnviar }) => {
    setupFormEnviar((nuevoMensaje) => {
      alert('Mensaje enviado correctamente');
      if (categoriaActiva) renderMessagesWithPreview(categoriaActiva);
    });
  });
}

function mostrarPanelDebug() {
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');
  if (!previewContainer || !detailsContainer) return;

  previewContainer.innerHTML = `
    <div id="debug-panel" class="debug-container p-2 border-b mb-2 bg-gray-100 rounded"></div>
  `;

  detailsContainer.innerHTML = `
    <div class="p-4">
      <h3 class="text-lg font-bold mb-2">🐞 Panel de Debug</h3>
      <p>Usa el selector para cambiar el perfil y el botón de refresco para actualizar mensajes.</p>
    </div>
  `;

  const debugPanel = previewContainer.querySelector('#debug-panel');
  if (debugPanel) {
    initDebugPanel(
      debugPanel,
      () => {
        console.log('[DEBUG] Refrescando mensajes desde panel lateral');
        if (categoriaActiva) renderMessagesWithPreview(categoriaActiva);
      },
      (nuevoPerfil) => {
        console.log('[DEBUG] Perfil cambiado a:', nuevoPerfil);
        perfilActivo = nuevoPerfil;
        if (categoriaActiva) renderMessagesWithPreview(categoriaActiva);
      }
    );

    const messageListContainer = document.getElementById('mailbox-message-list');
    if (messageListContainer) messageListContainer.innerHTML = '';

    const detailsContainer2 = document.getElementById('mailbox-details');
    if (detailsContainer2) detailsContainer2.innerHTML = '';
  }
}
