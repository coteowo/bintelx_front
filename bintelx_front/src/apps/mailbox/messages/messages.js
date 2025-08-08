
import { renderPreview } from '../preview/preview.js';
import { renderDetails } from '../details/details.js';


import { cargarMensajes, getPerfilActivo } from '../utils/storage.js';



// Marca visual del mensaje seleccionado
function setActiveMessage(container, selectedDiv) {
  const items = container.querySelectorAll('.message-item');
  items.forEach(item => item.classList.remove('bg-gray-300'));
  selectedDiv.classList.add('bg-gray-300');
}

// Función principal
export function renderMessageList(container, onSelect, filtro = 'todos', perfilActivo) {
  container.innerHTML = '';

  const refreshBtn = document.getElementById('btn-refresh');
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      renderMessageList(container, onSelect, filtro, perfilActivo);
    };
  }

  if (!perfilActivo) {
    console.warn('renderMessageList: No se recibió perfilActivo');
    return;
  }

  const perfil = perfilActivo.toLowerCase().trim();
  const conversaciones = cargarMensajes();

  // Filtrar mensajes según categoría y perfil activo
  const mensajesFiltrados = conversaciones.filter(conv => {
    if (!conv.category || !conv.from || !conv.to) return false;

    const from = conv.from.toLowerCase().trim();
    const to = conv.to.toLowerCase().trim();

    if (filtro === 'todos') {
      // Mostrar mensajes que involucren al perfil activo ya sea de remitente o destinatario
      return from === perfil || to === perfil;
    }

    if (filtro === 'inbox') {
      // En la bandeja de entrada el perfil es el destinatario
      return conv.category === 'inbox' && to === perfil;
    }

    if (filtro === 'sent') {
      // En enviados el perfil es el remitente
      return conv.category === 'sent' && from === perfil;
    }

    // Para otras categorías posibles
    return conv.category === filtro && (from === perfil || to === perfil);
  });

  mensajesFiltrados.forEach(conv => {
    const convDiv = document.createElement('div');
    convDiv.classList.add('message-item', 'cursor-pointer', 'p-2', 'border-b');
    convDiv.innerHTML = `
      <h3 class="font-semibold">${conv.subject}</h3>
      <p class="text-sm">${conv.from} - ${conv.preview || conv.body.substring(0, 30)}</p>
    `;

    convDiv.addEventListener('click', () => {
      // Marca el mensaje seleccionado
      const items = container.querySelectorAll('.message-item');
      items.forEach(item => item.classList.remove('bg-gray-300'));
      convDiv.classList.add('bg-gray-300');

      onSelect(conv.id);
    });

    container.appendChild(convDiv);
  });

  // Opcional: si no hay mensajes, mostrar mensaje vacío
  if (mensajesFiltrados.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No hay mensajes para mostrar.</p>';
  }
}


