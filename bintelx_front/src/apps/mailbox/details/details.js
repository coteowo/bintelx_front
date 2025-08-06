import { conversations, actions } from '../data.mock.js';
import initMessageForm from './message-form.js';
import tplCompose from '../mail/message-compose.tpls';

export function renderDetails(container, messageId) {
  const msg = conversations.find(m => m.id === messageId);
  if (!msg) {
    container.innerHTML = '';
    return;
  }

  // Mostrar datos del mensaje + acciones + espacio para mensajes + zona respuesta rápida
  container.innerHTML = `
    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div><small class="text-gray-500">${msg.date}</small></div>

    <div class="mt-4 flex gap-2">
      ${actions.map(action => `<button class="btn-action px-3 py-1 rounded border" data-action="${action.action}">${action.icon} ${action.label}</button>`).join('')}
    </div>

    <main class="overflow-y-auto max-h-40 bg-white rounded shadow-inner p-3 mb-4 flex flex-col gap-2"></main>

    <footer class="mb-4">
      ${tplCompose}
    </footer>
  `;

  // Inicializar mensajes y formulario dentro del panel (puedes adaptar initMessageForm para que también funcione con tplCompose)
  initMessageForm(container);

  // Lógica para toggle sidebar
  const sidebar = document.getElementById('mailbox-details-panel');
  const toggleBtn = document.getElementById('toggle-sidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const collapsed = sidebar.classList.contains('collapsed');
    toggleBtn.textContent = collapsed ? '🡺 Mostrar' : '🡸 Ocultar';
  });
}
