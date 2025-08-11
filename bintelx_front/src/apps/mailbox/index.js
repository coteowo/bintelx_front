// src/apps/mailbox/index.js

import ActionToolbar from "../../bnx/components/action-toolbar/ActionToolbar";
import { folders } from './data.mock.js';

import './index.css';
import './folders/folders.css';
import './messages/messages.css';
import './preview/preview.css';
import './details/details.css';

import { initDebugPanel, getCurrentDebugProfile } from './_debug/debug.js';
import { cargarMensajes } from './utils/storage.js';

import { renderFolders } from './folders/folders.js';
import { renderMessageList } from './messages/messages.js';
import { renderPreview } from './preview/preview.js';
import { renderDetails } from './details/details.js';
import initMessageForm from './details/message-form.js';

import layoutTpl from './index.tpls?raw';
import foldersTpl from './folders/panel-folders.tpls?raw';
import listTpl from './messages/panel-list.tpls?raw';
import previewTpl from './preview/panel-preview.tpls?raw';
import detailsTpl from './details/panel-details.tpls?raw';

import { setupFormEnviar } from './messages/message-form.js';

export default function renderMailboxApp(container) {
  // 1. Montar layout base
  container.innerHTML = layoutTpl;

  // 2. Montar paneles desde templates
  document.getElementById('mailbox-panel-folders').innerHTML = foldersTpl;
  document.getElementById('mailbox-panel-list').innerHTML = listTpl;
  document.getElementById('mailbox-panel-preview').innerHTML = previewTpl;
  document.getElementById('mailbox-panel-details').innerHTML = detailsTpl;

  setTimeout(() => {
    const debugContainer = document.getElementById('debug-panel');
    if (debugContainer) {
      initDebugPanel(debugContainer, () => {
        console.log('[DEBUG] Refrescando mensajes para:', getCurrentDebugProfile());
        renderFilteredMessages('todos');
      });
    }
    setupMailboxFeatures();
  }, 0);
}

// 🔹 Nueva función para filtrar mensajes por carpeta y perfil
function renderFilteredMessages(category) {
  const perfilActivo = getCurrentDebugProfile();
  const mensajes = cargarMensajes();

  const mensajesFiltrados = mensajes.filter(msg => {
    if (category === 'inbox') {
      return msg.category === 'inbox' &&
        (Array.isArray(msg.to) ? msg.to.includes(perfilActivo) : msg.to === perfilActivo);
    }
    if (category === 'sent') {
      return msg.category === 'sent' && msg.from === perfilActivo;
    }
    if (category === 'todos') {
      return msg.to === perfilActivo || msg.from === perfilActivo;
    }
    return msg.category === category &&
      (msg.to === perfilActivo || msg.from === perfilActivo);
  });

  renderMessageList(
    document.getElementById('mailbox-message-list'),
    handleMessageClick,
    mensajesFiltrados
  );
}

function handleMessageClick(id) {
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');

  renderPreview(previewContainer, id);
  renderDetails(detailsContainer, id);
  initMessageForm(detailsContainer);
}

function setupMailboxFeatures() {
  const foldersContainer = document.getElementById('mailbox-folders');
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');

  // Sidebar toggle
  const toggleBtn = document.getElementById('toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('mailbox-details-panel');
      sidebar.classList.toggle('collapsed');
      const collapsed = sidebar.classList.contains('collapsed');
      toggleBtn.textContent = collapsed ? '🡺 Mostrar' : '🡸 Ocultar';
    });
  }

  if (!foldersContainer || !previewContainer || !detailsContainer) {
    console.error('Faltan contenedores en el DOM');
    return;
  }

  // Toolbar acciones
  const toolbarEl = document.getElementById("details-toolbar");
  if (toolbarEl) {
    const toolbar = new ActionToolbar(toolbarEl);

    toolbarEl.querySelector('[data-action="marcar-importante"]')?.addEventListener("click", () => {
      console.log("⚠ Marcado como importante");
    });

    toolbarEl.querySelector('[data-action="notificar"]')?.addEventListener("click", () => {
      console.log("🔔 Notificar");
    });

    toolbarEl.querySelector('[data-action="eliminar"]')?.addEventListener("click", () => {
      console.log("🗑️ Eliminar");
    });
  }

  // Render carpetas
  renderFolders(foldersContainer);

  // Render lista mensajes (por defecto inbox)
  renderFilteredMessages('inbox');

  // Setup formulario
  setupFormEnviar(() => {
    renderFilteredMessages('sent');
  });
}
