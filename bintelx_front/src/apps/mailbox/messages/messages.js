import { cargarMensajes } from '../utils/storage.js';
import { renderPreview } from '../preview/preview.js';
import { renderDetails } from '../details/details.js';

// Ya no usamos esta variable global:
// const messageListContainer = document.getElementById('mailbox-message-list');

function setActiveMessage(container, selectedDiv) {
  const items = container.querySelectorAll('.message-item');
  items.forEach(item => item.classList.remove('bg-gray-300'));
  selectedDiv.classList.add('bg-gray-300');
}

export function renderMessageList(container, onSelect, filtro = 'todos') {
  container.innerHTML = '';

  const conversaciones = cargarMensajes(); // Cargar desde localStorage

  const mensajesFiltrados = conversaciones.filter(conv => {
    if (filtro === 'todos') return true;
    return conv.category === filtro;
  });

  mensajesFiltrados.forEach(conv => {
    const convDiv = document.createElement('div');
    convDiv.classList.add('message-item', 'cursor-pointer', 'p-2', 'border-b');
    convDiv.innerHTML = `
      <h3 class="font-semibold">${conv.subject}</h3>
      <p class="text-sm">${conv.from} - ${conv.preview || conv.body.substring(0, 30)}</p>
    `;

    convDiv.addEventListener('click', () => {
      setActiveMessage(container, convDiv); // Pasamos el container aquí
      onSelect(conv.id); // Pasar solo el ID
    });

    container.appendChild(convDiv);
  });
}
