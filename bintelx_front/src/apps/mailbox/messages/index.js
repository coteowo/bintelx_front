// src/apps/mailbox/messages/index.js

function setActiveMessage(container, selectedDiv) {
  const items = container.querySelectorAll('.message-item');
  items.forEach(item => item.classList.remove('bg-gray-300'));
  selectedDiv.classList.add('bg-gray-300');
}

/**
 * Renderiza la lista de mensajes trayéndolos desde la BD
 * @param {HTMLElement} container - contenedor donde renderizar
 * @param {Function} onSelect - callback al hacer click (recibe el id del mensaje)
 * @param {Object} perfilActivo - perfil actual (ej: { email, name })
 * @param {String} carpeta - 'inbox' | 'sent'
 */
export async function renderMessageList(container, onSelect, perfilActivo, carpeta = 'inbox') {
  container.replaceChildren(); // ✅ limpia completamente el contenedor y listeners

  if (!perfilActivo || !perfilActivo.email) {
    console.warn('renderMessageList: No se recibió perfilActivo o no tiene email');
    container.textContent = 'Selecciona un perfil en el panel debug.';
    return;
  }

  try {
    const resp = await fetch(
      `http://localhost:3001/api/messages?category=${carpeta}&perfil=${perfilActivo.email}`
    );
    if (!resp.ok) throw new Error(`Error al obtener mensajes: ${resp.statusText}`);
    const mensajes = await resp.json();
    console.log('[API] Mensajes recibidos:', mensajes);

    if (!mensajes || mensajes.length === 0) {
      container.textContent = 'No hay mensajes para mostrar.';
      return;
    }

    mensajes.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('message-item', 'cursor-pointer', 'p-2', 'border-b', 'hover:bg-gray-100');

      const fromToLabel = carpeta === 'sent'
        ? `Para: ${msg.recipient}`
        : `De: ${msg.sender}`;

      msgDiv.innerHTML = `
        <h3 class="font-semibold">${msg.subject || '(Sin asunto)'}</h3>
        <p class="text-sm text-gray-700">${fromToLabel}</p>
        <p class="text-xs text-gray-500">${msg.body ? msg.body.substring(0, 50) + '…' : ''}</p>
      `;

      // ✅ Listener único
      msgDiv.onclick = () => {
        setActiveMessage(container, msgDiv);
        console.log('[CLICK MENSAJE]', msg);
        onSelect(msg);
      };

      container.appendChild(msgDiv);
    });

    console.log(`[MAILBOX] Perfil activo: ${perfilActivo.email} | Carpeta: ${carpeta} | Mensajes renderizados: ${mensajes.length}`);

  } catch (err) {
    console.error('[MAILBOX] Error cargando mensajes:', err);
    container.textContent = 'Error al cargar mensajes.';
  }
}
