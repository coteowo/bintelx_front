import { conversations, selectedMessage } from './data.mock.js';

export function renderPreview(container, messageId) {
  const msg = conversations.find(m => m.id === messageId);
  if (!msg) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <section class="preview-card p-4 bg-white rounded shadow space-y-3">
      <div class="preview-field">
        <strong>De:</strong>
        <span class="preview-value">${msg.from}</span>
      </div>
      <div class="preview-field">
        <strong>Para:</strong>
        <span class="preview-value">${selectedMessage.to || ''}</span>
      </div>
      <div class="preview-field">
        <strong>Asunto:</strong>
        <span class="preview-value">${msg.subject}</span>
      </div>
      <div class="preview-body mt-2 border-t pt-2 text-gray-700">
        ${selectedMessage.body}
      </div>
    </section>
  `;
}
