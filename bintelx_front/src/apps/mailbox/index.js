// src/apps/mailbox/index.js
import { loadComponent } from "../../bnx/loader.js";
import ActionToolbar from "../../bnx/components/action-toolbar/ActionToolbar";

import './index.css';
import './folders/folders.css';
import './messages/messages.css';
import './preview/preview.css';
import './details/details.css';

import { initDebugPanel, getCurrentDebugProfile } from './_debug/debug.js';
import { cargarMensajes } from './utils/storage.js';

import layoutTpl from './index.tpls?raw';
window.devlog = (...args) => console.log('[DEVLOG]', ...args);

export default async function renderMailboxApp(container) {
  // 1. Montar layout base (estructura de 4 paneles vacíos)
  container.innerHTML = layoutTpl;

  // 2. Montar paneles dinámicamente con loadComponent
  await loadComponent("mailbox/folders", "#mailbox-panel-folders");
  await loadComponent("mailbox/messages", "#mailbox-panel-list");
  await loadComponent("mailbox/preview", "#mailbox-panel-preview");
  await loadComponent("mailbox/details", "#mailbox-panel-details");

  // 3. Inicialización asincrónica
  setTimeout(() => {
    setupMailboxFeatures();
  }, 0);
}

// 🔹 Filtrar mensajes según carpeta y perfil
async function renderFilteredMessages(category) {
  const { renderMessageList } = await import("./messages/index.js");
  const perfilActivo = getCurrentDebugProfile();
  const mensajes = await cargarMensajes();

  if (!perfilActivo || !perfilActivo.email) {
    console.warn("[MAILBOX] No hay perfil activo válido en renderFilteredMessages");
    return;
  }

  const mensajesFiltrados = mensajes.filter(msg => {
    if (category === 'inbox') {
      return msg.recipient === perfilActivo.email;
    }
    if (category === 'sent') {
      return msg.from?.email === perfilActivo.email;
    }
    if (category === 'todos') {
      return msg.recipient === perfilActivo.email || msg.sender === perfilActivo.email;
    }
    return msg.category === category &&
      (msg.recipient === perfilActivo.email || msg.sender === perfilActivo.email);
  });

  console.log("[DEBUG antes de renderMessageList]", {
    perfilActivo,
    category,
    mensajesFiltrados
  });

renderMessageList(
  document.getElementById('mailbox-message-list'),
  handleMessageClick,
  perfilActivo,   // 👈 pasar aquí el perfil actual
  category        // 👈 usar la categoría real (inbox, sent, etc.)
);

}


// 🔹 Mostrar preview de un mensaje
function showPreview(id) {
  const previewContainer = document.getElementById('mailbox-panel-preview');
  previewContainer.innerHTML = '';
  import('./preview/index.js').then(({ renderPreview }) => {
    renderPreview(previewContainer, id);
  });
}

// 🔹 Mostrar panel debug
function showDebug() {
  const previewContainer = document.getElementById('mailbox-panel-preview');
  previewContainer.innerHTML = '';
  initDebugPanel(previewContainer, () => {
    renderFilteredMessages('todos');
  });
}

// 🔹 Manejar clic en un mensaje
async function handleMessageClick(id) {
  const detailsPanel = document.getElementById('mailbox-details-panel');
  const detailsInfo = detailsPanel.querySelector('.details-info');
  const detailsForm = detailsPanel.querySelector('.details-form');
  const mainDetails = detailsPanel.querySelector('#mailbox-details');

  showPreview(id); // Renderiza el mensaje en el preview

  const { cargarMensajes } = await import('./utils/storage.js');
  const mensajes = cargarMensajes();
  const msg = mensajes.find(m => m.id === id) || null;

  // Limpia las secciones internas
  detailsInfo.innerHTML = '';
  detailsForm.innerHTML = '';
  mainDetails.innerHTML = '';

  // Si hay mensaje existente, muestra info
  if (msg) {
    detailsInfo.innerHTML = `
      <div><strong>De:</strong> ${msg.from}</div>
      <div><strong>Para:</strong> ${msg.to || ''}</div>
      <div><strong>Asunto:</strong> ${msg.subject}</div>
      <div><small class="text-gray-500">${msg.date}</small></div>
    `;
  }

  // Renderiza el formulario solo en detailsForm
  const { renderDetails } = await import('./details/index.js');
}

// 🔹 Configurar la aplicación de mailbox
// 🔹 Configurar la aplicación de mailbox
async function setupMailboxFeatures() {
  const { renderFolders } = await import("./folders/index.js");


  const foldersContainer = document.getElementById('mailbox-panel-folders');
  const previewContainer = document.getElementById('mailbox-panel-preview');
  const detailsContainer = document.getElementById('mailbox-panel-details');
  const detailsPanel = document.getElementById('mailbox-details-panel');

  // Sidebar toggle
  const toggleBtn = document.getElementById('toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      detailsPanel.classList.toggle('collapsed');
      toggleBtn.textContent = detailsPanel.classList.contains('collapsed') ? '🡺 Mostrar' : '🡸 Ocultar';
    });
  }

  if (!foldersContainer || !previewContainer || !detailsContainer) {
    console.error('Faltan contenedores en el DOM');
    return;
  }

  // Toolbar acciones
  const toolbarEl = document.getElementById("details-toolbar");
  if (toolbarEl) {
    new ActionToolbar(toolbarEl);
    toolbarEl.querySelector('[data-action="marcar-importante"]')?.addEventListener("click", () => console.log("⚠ Marcado como importante"));
    toolbarEl.querySelector('[data-action="notificar"]')?.addEventListener("click", () => console.log("🔔 Notificar"));
    toolbarEl.querySelector('[data-action="eliminar"]')?.addEventListener("click", () => console.log("🗑️ Eliminar"));
  }

  // Montar formulario global de envío una sola vez
  if (!detailsPanel.querySelector('#zona-enviar')) {
    const { default: messageFormTpl } = await import('./messages/message_form.tpls?raw');
  }

  // Render carpetas y manejar clics de debug / send
renderFolders(foldersContainer, async (category) => {
  const messageListContainer = document.getElementById('mailbox-message-list');
  messageListContainer.innerHTML = ''; // elimina nodos previos y sus listeners
  const detailsPanel = document.getElementById('mailbox-details-panel');
  const detailsForm = detailsPanel.querySelector('.details-form');

  if (messageListContainer) messageListContainer.innerHTML = '';

  if (category === 'debug') {
    showDebug();
  } 
  else if (category === 'send') {
    // Limpiar formulario y mostrar “nuevo mensaje”
    detailsForm.innerHTML = ''; // limpia cualquier contenido previo
    
  // ✅ Quitar listeners del form previo
  const oldForm = detailsForm.querySelector('form');
    if (oldForm) {
    const newForm = oldForm.cloneNode(false); // clone sin listeners
    oldForm.replaceWith(newForm);
  }

    const { renderDetails } = await import("./details/index.js");
    renderDetails(detailsForm, null, async () => {
      await renderFilteredMessages('sent'); // refresca enviados después de enviar
    });
  } 
  else {
    await renderFilteredMessages(category);
  }
});


  // Render lista mensajes por defecto
  await renderFilteredMessages('inbox');
}
