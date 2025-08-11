import { renderPreview } from '../preview/preview.js';
import { renderDetails } from '../details/details.js';
import { cargarMensajes } from '../utils/storage.js';

// Marca visual del mensaje seleccionado
function setActiveMessage(container, selectedDiv) {
  const items = container.querySelectorAll('.message-item');
  items.forEach(item => item.classList.remove('bg-gray-300'));
  selectedDiv.classList.add('bg-gray-300');
}

// Normaliza un valor de email para comparar
function normalizeEmail(email) {
  return (email || '').toLowerCase().trim();
}

// Función principal
export function renderMessageList(container, onSelect, filtro = 'todos', perfilActivo) {
  container.innerHTML = '';

  if (!perfilActivo) {
    console.warn('renderMessageList: No se recibió perfilActivo');
    container.innerHTML = '<p class="text-center text-gray-500">Selecciona un perfil en el panel debug.</p>';
    return;
  }

  const perfil = normalizeEmail(perfilActivo);
  const conversaciones = cargarMensajes();

  // Filtrar mensajes según categoría y perfil activo
  const mensajesFiltrados = conversaciones.filter(conv => {
    if (!conv.from || !conv.to) return false;

    const from = normalizeEmail(conv.from);
    const toList = Array.isArray(conv.to) ? conv.to.map(normalizeEmail) : [normalizeEmail(conv.to)];

    if (filtro === 'todos') {
      // Mostrar mensajes que involucren al perfil activo como remitente o destinatario
      return from === perfil || toList.includes(perfil);
    }

    if (filtro === 'inbox') {
      // En bandeja de entrada, mostrar mensajes donde perfil es destinatario (no es obligatorio category === 'inbox')
      return toList.includes(perfil);
    }

    if (filtro === 'sent') {
      // En enviados, mostrar mensajes donde perfil es remitente y category es 'sent'
      return conv.category === 'sent' && from === perfil;
    }

    // Para otras carpetas, filtrar por categoría y que perfil esté involucrado
    return conv.category === filtro && (from === perfil || toList.includes(perfil));
  });

  // Renderizar lista
  if (mensajesFiltrados.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No hay mensajes para mostrar.</p>';
    return;
  }

  mensajesFiltrados.forEach(conv => {
    const convDiv = document.createElement('div');
    convDiv.classList.add('message-item', 'cursor-pointer', 'p-2', 'border-b');
    convDiv.innerHTML = `
      <h3 class="font-semibold">${conv.subject || '(Sin asunto)'}</h3>
      <p class="text-sm">${conv.from} - ${conv.preview || (conv.body ? conv.body.substring(0, 30) : '')}</p>
    `;

    convDiv.addEventListener('click', () => {
      setActiveMessage(container, convDiv);
      onSelect(conv.id);
    });

    container.appendChild(convDiv);
  });

  console.log('Perfil activo:', perfilActivo);
  console.log('Mensajes totales:', conversaciones.length);
  console.log('Mensajes filtrados:', mensajesFiltrados.length, mensajesFiltrados);
}
