// bintelx_front\src\apps\mailbox\message-form.js

import { conversations, actions } from '../data.mock.js';
import { renderMessageList } from '../messages/messages.js';



export default function initMessageForm(container) {
  // Busca el contenedor específico de mensajes (ejemplo: un div o main con id o clase concreta)
  const messagesContainer = container.querySelector('.message-list'); // cambiar acorde a tu tplCompose
  const input = container.querySelector('.message-input');            // input específico para el mensaje
  const sendButton = container.querySelector('.send-button');         // botón específico de envío

  if (!messagesContainer || !input || !sendButton) {
    console.warn('initMessageForm: elementos del formulario no encontrados');
    return;
  }

  function addMessage(text, isOwn = true) {
    const message = document.createElement('div');
    message.className = `max-w-[75%] p-2 rounded-lg shadow text-sm whitespace-pre-wrap ${
      isOwn ? 'bg-blue-100 self-end text-right' : 'bg-gray-200 self-start text-left'
    }`;
    message.textContent = text;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';

    // Simulación de respuesta automática
    setTimeout(() => {
      addMessage('Mensaje recibido ✔️', false);
    }, 800);
  }

  sendButton.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });
}

export function showMessage(id, previewContainer, detailsContainer) {
  const msg = conversations.find(m => m.id === id);
  if (!msg) return;

  previewContainer.innerHTML = `
    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Para:</strong> ${msg.to || ''}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div class="mt-2">${msg.body}</div>
  `;

  detailsContainer.innerHTML = `
    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div><small class="text-gray-500">${msg.date}</small></div>

    <div class="mt-4 flex gap-2">
      ${actions.map(action => `
        <button class="btn-action px-3 py-1 rounded border" data-action="${action.action}">
          ${action.icon} ${action.label}
        </button>
      `).join('')}
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

  initMessageForm(detailsContainer);
}

// ✅ Ajustado: también recibe messageContainer como argumento
function initFilterButtons(buttonContainer, messageContainer, handleSelect) {
  const buttons = buttonContainer.querySelectorAll(".btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("btn-active"));
      button.classList.add("btn-active");

      const tipo = button.dataset.filter || button.textContent.trim().toLowerCase();
      renderMessageList(messageContainer, handleSelect, tipo);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const messageContainer = document.getElementById("mailbox-message-list");
  const previewContainer = document.getElementById("mailbox-preview");
  const detailsContainer = document.getElementById("mailbox-details");
  const filtroContainer = document.querySelector("section.card1"); // donde están los botones

  const handleSelect = (id) => {
    showMessage(id, previewContainer, detailsContainer);
  };

  // ✅ Corregido: pasa también el contenedor de mensajes
  initFilterButtons(filtroContainer, messageContainer, handleSelect);

  // Carga inicial
  renderMessageList(messageContainer, handleSelect, "todos");
});
