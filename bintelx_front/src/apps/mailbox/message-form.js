export default function initMessageForm(container) {
  const messagesContainer = container.querySelector('main');
  const input = container.querySelector('input');
  const sendButton = container.querySelector('button');

  function addMessage(text, isOwn = true) {
    const message = document.createElement('div');
    message.className = `max-w-[75%] p-2 rounded-lg shadow text-sm whitespace-pre-wrap ${
      isOwn
        ? 'bg-blue-100 self-end text-right'
        : 'bg-gray-200 self-start text-left'
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
function showMessage(id) {
  const msg = conversations.find(m => m.id === id);
  if (!msg) return;

  // Actualiza el panel "Vista Previa"
  previewContainer.innerHTML = `
    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Para:</strong> ${selectedMessage.to || ''}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div class="mt-2">${selectedMessage.body}</div>
  `;

  // Actualiza el panel "Detalles" con el formulario
  detailsContainer.innerHTML = `
    <div><strong>De:</strong> ${msg.from}</div>
    <div><strong>Asunto:</strong> ${msg.subject}</div>
    <div><small class="text-gray-500">${msg.date}</small></div>
    <div class="mt-4 flex gap-2">
      ${actions.map(action => `<button class="btn-action px-3 py-1 rounded border" data-action="${action.action}">${action.icon} ${action.label}</button>`).join('')}
    </div>

    <!-- Aquí va el HTML del formulario -->
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

  // Inicializa la lógica del formulario
  initMessageForm(detailsContainer);
}
