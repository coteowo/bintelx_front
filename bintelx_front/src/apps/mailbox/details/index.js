import initMessageForm from './message-form.js';

/**
 * Renderiza el panel de detalles de un mensaje o nuevo mensaje
 */
export function renderDetails(container, message = null, onSendCallback) {
  if (!container) return;

  // Contenedor de info y formulario
  let infoContainer = container.querySelector('.details-info');
  if (!infoContainer) {
    infoContainer = document.createElement('div');
    infoContainer.classList.add('details-info');
    container.appendChild(infoContainer);
  }

  let formContainer = container.querySelector('.details-form');
  if (!formContainer) {
    formContainer = document.createElement('div');
    formContainer.classList.add('details-form');
    container.appendChild(formContainer);
  }

  // Render info del mensaje
  if (message) {
    infoContainer.innerHTML = `
      <div><strong>De:</strong> ${message.from}</div>
      <div><strong>Asunto:</strong> ${message.subject}</div>
      <div><small class="text-gray-500">${message.date}</small></div>
      <div class="mt-4 flex gap-2">
        ${message.actions?.map(a => `<button class="btn-action px-3 py-1 rounded border">${a.icon} ${a.label}</button>`).join('') || ''}
      </div>
      <div class="message-list overflow-y-auto max-h-40 bg-white rounded shadow-inner p-3 mb-4 flex flex-col gap-2">
        ${message.body || ''}
      </div>
    `;
  } else {
    infoContainer.innerHTML = '';
  }

  // 🔹 Si el formulario ya existe, actualiza sus campos en lugar de recrearlo
  let existingForm = formContainer.querySelector('form');
  if (existingForm) {
    const toField = existingForm.querySelector('input[type="email"]');
    const subjectField = existingForm.querySelector('input[type="text"]');
    const bodyField = existingForm.querySelector('textarea');

    if (toField) toField.value = message?.from || '';
    if (subjectField) subjectField.value = message?.subject ? `Re: ${message.subject}` : '';
    if (bodyField) bodyField.value = message?.body ? `\n\n--- Original message ---\n${message.body}` : '';
  } else {
    // Si no existe, inicializar el formulario solo una vez
    initMessageForm(formContainer, message, onSendCallback);
  }
}
