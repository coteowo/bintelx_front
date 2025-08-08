import { actions } from '../data.mock.js';
import { cargarMensajes } from '../utils/storage.js';
import initMessageForm from './message-form.js';
import tplCompose from '../mail/message-compose.tpls';

export function renderDetails(container, messageId) {
  const conversations = cargarMensajes(); // ✅ Usa los mensajes actuales desde localStorage
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

    <main class="message-list overflow-y-auto max-h-40 bg-white rounded shadow-inner p-3 mb-4 flex flex-col gap-2">
      <!-- Aquí se inyectarán los mensajes -->
    </main>

    <footer class="flex gap-2 mb-4">
      <input
        type="text"
        class="message-input flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe un mensaje..."
      />
      <button class="send-button bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
        Enviar
      </button>
    </footer>
  `;

  initMessageForm(container); // Esto debe usar también cargarMensajes() internamente


}
