import { conversations, actions } from '../data.mock.js';
import { renderMessageList } from '../messages/messages.js';
import { cargarMensajes } from '../utils/storage.js';
import { getCurrentDebugProfile } from '../_debug/debug.js'; // ajusta ruta si hace falta

// Variable global para mantener los mensajes actuales
let mensajesGlobal = [];

export default function initMessageForm(container) {
  const messagesContainer = container.querySelector('.message-list');
  const input = container.querySelector('.message-input');
  const sendButton = container.querySelector('.send-button');

  if (!messagesContainer || !input || !sendButton) {
    console.warn('initMessageForm: elementos del formulario no encontrados');
    return;
  }

  // Si ya hay mensajes en mensajesGlobal, renderizarlos
  messagesContainer.innerHTML = '';
  mensajesGlobal.forEach(({ from, body, isOwn }) => {
    addMessageElement(messagesContainer, { from, body, isOwn });
  });

  function addMessageElement(container, { from, body, isOwn }) {
    const message = document.createElement('div');
    message.className = `max-w-[75%] p-2 rounded-lg shadow text-sm whitespace-pre-wrap ${
      isOwn ? 'bg-blue-100 self-end text-right' : 'bg-gray-200 self-start text-left'
    }`;
    message.innerHTML = `<strong>${from}:</strong> ${body}`;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
  }

  function addMessageObj(msgObj) {
    mensajesGlobal.push(msgObj);
    addMessageElement(messagesContainer, msgObj);
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    const perfilActivo = getCurrentDebugProfile();

    addMessageObj({ from: perfilActivo, body: text, isOwn: true });

    input.value = '';

    setTimeout(() => {
      addMessageObj({ from: 'Sistema', body: 'Mensaje recibido ✔️', isOwn: false });
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
  const mensajes = cargarMensajes(); // o usa mensajesGlobal si quieres

  const msg = mensajes.find(m => m.id === id);
  if (!msg) return;

  previewContainer.innerHTML = `
    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Para:</strong> ${msg.to || ''}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div class="mt-2">${msg.body}</div>
  `;

  // Aquí no reemplaces todo detailsContainer, solo actualiza la parte de detalles
  detailsContainer.querySelector('.details-info')?.remove();

  const detailsInfo = document.createElement('div');
  detailsInfo.classList.add('details-info');
  detailsInfo.innerHTML = `
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
  `;

  // Inserta detailsInfo antes del formulario (asumiendo que el formulario está al final)
  const formElement = detailsContainer.querySelector('footer');
  if (formElement) {
    detailsContainer.insertBefore(detailsInfo, formElement);
  } else {
    // Si no hay footer, solo añade
    detailsContainer.appendChild(detailsInfo);
  }

  // No vuelvas a llamar initMessageForm aquí para no resetear mensajes
}

// Función para inicializar botones filtro, sin cambios
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
  const filtroContainer = document.querySelector("section.card1");

  const handleSelect = (id) => {
    showMessage(id, previewContainer, detailsContainer);
  };

  initFilterButtons(filtroContainer, messageContainer, handleSelect);

  // Carga inicial
  renderMessageList(messageContainer, handleSelect, "todos");

  // Inicializa el formulario para enviar mensajes (con mensajes vacíos al inicio)
  initMessageForm(detailsContainer);
});
