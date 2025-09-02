import { getCurrentDebugProfile } from '../_debug/debug.js';

export default function initMessageForm(container, message, onSendCallback) {
  if (!container) return;

  container.innerHTML = '';

  const form = document.createElement('form');
  form.classList.add('message-form', 'flex', 'flex-col', 'gap-3');

  const toField = document.createElement('input');
  toField.type = 'email';
  toField.placeholder = 'To';
  toField.classList.add('border', 'p-2', 'rounded');
  if (message?.from) toField.value = message.from;

  const subjectField = document.createElement('input');
  subjectField.type = 'text';
  subjectField.placeholder = 'Subject';
  subjectField.classList.add('border', 'p-2', 'rounded');
  if (message?.subject) subjectField.value = `Re: ${message.subject}`;

  const bodyField = document.createElement('textarea');
  bodyField.placeholder = 'Write your message...';
  bodyField.classList.add('border', 'p-2', 'rounded', 'min-h-32');
  if (message?.body) bodyField.value = `\n\n--- Original message ---\n${message.body}`;

  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.textContent = 'Send';
  sendButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-blue-600');

  form.appendChild(toField);
  form.appendChild(subjectField);
  form.appendChild(bodyField);
  form.appendChild(sendButton);

  let sending = false; // ✅ Flag para evitar envíos duplicados

  // 🔹 Fix opción 1: agregar listener solo una vez
  if (!form.dataset.listenerAdded) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return; // evita doble envío
      sending = true;

      const profile = getCurrentDebugProfile();
      const senderEmail = profile?.email || 'me@example.com';

      const newMessage = {
        sender: senderEmail,
        recipient: toField.value.trim(),
        subject: subjectField.value.trim(),
        body: bodyField.value.trim(),
      };

      console.log('Payload to send:', newMessage);

      if (!newMessage.sender || !newMessage.recipient) {
        alert('Debe completar remitente y destinatario.');
        sending = false;
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage),
        });

        if (!res.ok) throw new Error('Error sending message');
        const serverResponse = await res.json();
        console.log('Server response:', serverResponse);

        if (onSendCallback) {
          onSendCallback({
            id: serverResponse.id,
            sender: newMessage.sender,
            recipient: newMessage.recipient,
            subject: newMessage.subject,
            body: newMessage.body,
            timestamp: new Date().toISOString(),
          });
        }

        form.reset();
      } catch (err) {
        console.error('Failed to send message:', err);
        alert('Message could not be sent.');
      } finally {
        sending = false; // permite nuevos envíos
      }
    });

    form.dataset.listenerAdded = 'true'; // marca que ya se agregó el listener
  }

  container.appendChild(form);
}
