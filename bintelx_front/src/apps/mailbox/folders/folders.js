//bintelx_front\src\apps\mailbox\folders\folders.js
import { renderMessageList } from '../messages/messages.js';
import { renderPreview } from '../preview/preview.js';
import { renderDetails } from '../details/details.js';
import initMessageForm from '../details/message-form.js';
import { conversations } from '../data.mock.js';



export const sidebarOptions = [
  { name: 'Bandeja', icon: '📥', categoryFilter: 'inbox' },   // Bandeja de entrada
  { name: 'Enviados', icon: '📤', categoryFilter: 'sent' },   // Mensajes enviados
  { name: 'Dashboard', icon: '📊' },
  { name: 'Estadísticas', icon: '📈' },
  { name: 'Ayuda', icon: '❓' },
  { name: 'Enviar correo', icon: '✉️', isSendButton: true },
];

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

      // Marcar activo
      const buttons = container.querySelectorAll('button');
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      console.log(`Carpeta seleccionada: ${opt.name}`);

      // Si tiene filtro de categoría, renderizar mensajes y cargar el primero en preview y detalles
      if (opt.categoryFilter) {
        renderMessagesWithPreview(opt.categoryFilter);
      } else {
        // Lógica para otros botones si se requiere
      }
    });

    container.appendChild(btn);
  });

  // Opcional: activa el primer botón con filtro categoryFilter al cargar
  const firstFilterBtn = [...container.querySelectorAll('button')]
    .find(btn => btn.classList.contains('btn-folder') && sidebarOptions.find(opt => opt.name === btn.textContent.trim() && opt.categoryFilter));
  if (firstFilterBtn) firstFilterBtn.click();
}

// Función que renderiza lista filtrada, y además muestra primer mensaje en preview y detalles
function renderMessagesWithPreview(category) {
  const messageListContainer = document.getElementById('mailbox-message-list');
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');

  // Renderizar lista filtrada
  renderMessageList(messageListContainer, (id) => {
    // Cuando seleccionan otro mensaje, actualizar preview y detalles
    renderPreview(previewContainer, id);
    renderDetails(detailsContainer, id);
    initMessageForm(detailsContainer);
  }, category);

  // Obtener primer mensaje filtrado para mostrar por defecto
  const mensajesFiltrados = conversations.filter(msg => msg.category === category);
  if (mensajesFiltrados.length > 0) {
    const primerId = mensajesFiltrados[0].id;
    renderPreview(previewContainer, primerId);
    renderDetails(detailsContainer, primerId);
    initMessageForm(detailsContainer);
  } else {
    // Si no hay mensajes en esa categoría, limpiar preview y detalles
    previewContainer.innerHTML = '<p>No hay mensajes para mostrar.</p>';
    detailsContainer.innerHTML = '';
  }
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
      // Refrescar la lista en enviados para que el usuario vea el nuevo mensaje
      renderMessagesWithPreview('sent');
    });
  });
}
