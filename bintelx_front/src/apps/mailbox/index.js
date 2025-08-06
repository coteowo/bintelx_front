// src/apps/mailbox/index.js

import ActionToolbar from "../../bnx/components/action-toolbar/ActionToolbar";
import { folders } from './data.mock.js';

import './index.css';
import './folders/folders.css';
import './messages/messages.css';
import './preview/preview.css';
import './details/details.css';

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
  container.innerHTML = layoutTpl;

  document.getElementById('mailbox-panel-folders').innerHTML = foldersTpl;
  document.getElementById('mailbox-panel-list').innerHTML = listTpl;
  document.getElementById('mailbox-panel-preview').innerHTML = previewTpl;
  document.getElementById('mailbox-panel-details').innerHTML = detailsTpl;

  setupMailboxFeatures();
}

function setupMailboxFeatures() {
  const foldersContainer = document.getElementById('mailbox-folders');
  const messageListContainer = document.getElementById('mailbox-message-list');
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');

  if (!foldersContainer || !messageListContainer || !previewContainer || !detailsContainer) {
    console.error('Faltan contenedores en el DOM');
    return;
  }

  // Toolbar
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

  // Función para manejar clic en un mensaje
  const handleMessageClick = (id) => {
    renderPreview(previewContainer, id);
    renderDetails(detailsContainer, id);
    initMessageForm(detailsContainer);
  };

  // Renderizar lista de mensajes, pero sin auto-selección
  renderMessageList(messageListContainer, handleMessageClick, 'todos');

  // ❌ Eliminar esta parte para evitar vista previa automática
  // if (conversations.length > 0) {
  //   const firstId = conversations[0].id;
  //   handleMessageClick(firstId);
  // }

  // Al enviar un mensaje, volver a mostrar la lista completa
  setupFormEnviar(() => {
    renderMessageList(messageListContainer, handleMessageClick, 'todos');
  });
}
