import { conversations } from './data.mock.js';

export function renderMessageList(container, onSelect) {
  container.innerHTML = '';
  conversations.forEach(conv => {
    const convDiv = document.createElement('div');
    convDiv.className = `message-item p-3 rounded cursor-pointer hover:bg-gray-200 ${conv.unread ? 'font-bold' : ''}`;
    convDiv.dataset.id = conv.id;
    convDiv.innerHTML = `
      <div><strong>${conv.from}</strong></div>
      <div>${conv.subject}</div>
      <div class="text-xs text-gray-600">${conv.preview}</div>
      <div class="text-xs text-gray-500 text-right">${conv.date}</div>
    `;
    convDiv.addEventListener('click', () => onSelect(conv.id));
    container.appendChild(convDiv);
  });
}
