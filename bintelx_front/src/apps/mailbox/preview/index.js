/**
 * Renderiza el mensaje en el contenedor preview
 * @param {HTMLElement} container - contenedor donde montar el preview
 * @param {Object} message - mensaje completo { from, to, subject, body, date, category }
 * @param {Function} onQuickReply - callback opcional al enviar respuesta rápida
 */
export function renderPreview(container, message, onQuickReply) {
  if (!message) {
    container.innerHTML = '<p class="text-gray-500 text-center">Selecciona un mensaje para previsualizar.</p>';
    return;
  }

  const from = message.from || message.sender || '(Remitente desconocido)';
  const to = message.to || message.recipient || '(Destinatario no especificado)';
  const subject = message.subject || '(Sin asunto)';
  const body = message.body || '(Sin contenido)';

  container.innerHTML = `
    <section class="preview-card p-4 bg-white rounded shadow space-y-3">
      <div class="preview-field"><strong>De:</strong> <span class="preview-value">${from}</span></div>
      <div class="preview-field"><strong>Para:</strong> <span class="preview-value">${to}</span></div>
      <div class="preview-field"><strong>Asunto:</strong> <span class="preview-value">${subject}</span></div>
      <div class="preview-body mt-2 border-t pt-2 text-gray-700 whitespace-pre-wrap">${body}</div>
    </section>

    <footer class="flex gap-2 mt-4">
      <input
        id="quick-reply-input"
        type="text"
        placeholder="Escribe una respuesta rápida..."
        class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        id="quick-reply-send"
        class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >Enviar</button>
    </footer>
  `;

  const input = container.querySelector('#quick-reply-input');
  const sendBtn = container.querySelector('#quick-reply-send');

  sendBtn.addEventListener('click', () => {
    const replyText = input.value.trim();
    if (!replyText) return;

    if (typeof onQuickReply === 'function') {
      onQuickReply(replyText, message); // Pasamos texto y mensaje original
    }

    input.value = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });
}
