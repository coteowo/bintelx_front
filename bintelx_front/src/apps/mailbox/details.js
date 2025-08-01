import { conversations, actions } from './data.mock.js';
import initMessageForm from './message-form.js';

export function renderDetails(container, messageId) {
  const msg = conversations.find(m => m.id === messageId);
  if (!msg) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `


    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div><small class="text-gray-500">${msg.date}</small></div>
    <div class="mt-4 flex gap-2">
      ${actions.map(action => `<button class="btn-action px-3 py-1 rounded border" data-action="${action.action}">${action.icon} ${action.label}</button>`).join('')}
    </div>
    <main class="overflow-y-auto max-h-40 bg-white rounded shadow-inner p-3 mb-4 flex flex-col gap-2"></main>
    <footer class="flex gap-2">
      <input
        type="text"
        placeholder="Write a message..."
        class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">Enviar</button>
    </footer>
  `;

  initMessageForm(container);
const sidebar = document.getElementById('mailbox-details-panel');
const toggleBtn = document.getElementById('toggle-sidebar');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  const collapsed = sidebar.classList.contains('collapsed');
  toggleBtn.textContent = collapsed ? '🡺 Mostrar' : '🡸 Ocultar';
});

}
