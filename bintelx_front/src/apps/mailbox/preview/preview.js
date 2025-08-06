import { cargarMensajes, guardarMensajes } from '../utils/storage.js';
import { conversations } from '../data.mock.js';

// Renderiza el mensaje en el contenedor preview según el id del mensaje
export function renderPreview(container, messageId) {
  const mensajes = conversations;
  const msg = mensajes.find(m => m.id == messageId);

  if (!msg) {
    container.innerHTML = '<p>No se encontró el mensaje.</p>';
    return;
  }

  // Valores seguros para evitar "undefined"
  const from = msg.from || '(Remitente desconocido)';
  const to = msg.to || '(Destinatario no especificado)';
  const subject = msg.subject || '(Sin asunto)';
  const body = msg.body || '(Sin contenido)';

  container.innerHTML = `
    <section class="preview-card p-4 bg-white rounded shadow space-y-3">
      <div class="preview-field">
        <strong>De:</strong>
        <span class="preview-value">${from}</span>
      </div>
      <div class="preview-field">
        <strong>Para:</strong>
        <span class="preview-value">${to}</span>
      </div>
      <div class="preview-field">
        <strong>Asunto:</strong>
        <span class="preview-value">${subject}</span>
      </div>
      <div class="preview-body mt-2 border-t pt-2 text-gray-700 whitespace-pre-wrap">
        ${body}
      </div>
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

    const mensajesActualizados = cargarMensajes();

    const newId = mensajesActualizados.length
      ? Math.max(...mensajesActualizados.map(m => Number(m.id))) + 1
      : 1;

    const nuevoMensaje = {
      id: newId,
      from: to || 'yo@simulado.com',
      to: from,
      subject: subject.startsWith('RE:') ? subject : `RE: ${subject}`,
      body: replyText,
      date: new Date().toISOString().slice(0, 10),
      category: 'sent',
      unread: false,
    };

    mensajesActualizados.push(nuevoMensaje);
    guardarMensajes(mensajesActualizados);

    alert('Respuesta enviada correctamente.');
    input.value = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });
}
