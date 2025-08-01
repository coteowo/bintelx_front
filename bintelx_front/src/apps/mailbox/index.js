import ActionToolbar from "../../bnx/components/action-toolbar/ActionToolbar";
import { devlog, removeDomainPart } from "../../bnx/utils";
import { folders, conversations, selectedMessage, actions } from './data.mock.js';

import './index.css';
import './folders.css';
import './details.css';
import './messages.css';
import './preview.css';


import { Modal } from "../../bnx/components/Modal";
import { api } from "../../bnx/api";

import initMessageForm from './message-form.js';
import { renderFolders } from './folders.js';
import { renderMessageList } from './messages.js';
import { renderPreview } from './preview.js';
import { renderDetails } from './details.js';

import layoutTpl from './index.tpls?raw';
import foldersTpl from './panel-folders.tpls?raw';
import listTpl from './panel-list.tpls?raw';
import previewTpl from './panel-preview.tpls?raw';
import detailsTpl from './panel-details.tpls?raw';

// 👉 Paso 1: Exportar función que renderiza todo
export default function renderMailboxApp(container) {
  container.innerHTML = layoutTpl;

  document.getElementById('mailbox-panel-folders').innerHTML = foldersTpl;
  document.getElementById('mailbox-panel-list').innerHTML = listTpl;
  document.getElementById('mailbox-panel-preview').innerHTML = previewTpl;
  document.getElementById('mailbox-panel-details').innerHTML = detailsTpl;

  // 👉 Paso 2: Esperar a que se renderice todo y luego hacer setup
  setupMailboxFeatures();
}

// 👉 Paso 3: Setup independiente que inicializa eventos y toolbars
function setupMailboxFeatures() {
  const foldersContainer = document.getElementById('mailbox-folders');
  const messageListContainer = document.getElementById('mailbox-message-list');
  const previewContainer = document.getElementById('mailbox-preview');
  const detailsContainer = document.getElementById('mailbox-details');

  if (!foldersContainer || !messageListContainer || !previewContainer || !detailsContainer) {
    console.error('Faltan contenedores en el DOM');
    return;
  }

  // Inicializar ActionToolbar
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

  // Render carpetas (nombres) en el panel lateral izquierdo
  //renderFolders(foldersContainer);

  // Render botones tipo filtro por carpeta
  const folderButtonsContainer = document.getElementById("mailbox-folder-buttons");
  if (folderButtonsContainer) {
    folders.forEach(folder => {
      const btn = document.createElement("button");
      btn.className = "bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded w-full transition";
      btn.innerHTML = `${folder.name} <span class="text-sm text-gray-500 ml-2">(${folder.count})</span>`;
      btn.addEventListener("click", () => {
        console.log(`📁 Seleccionado: ${folder.name}`);
        // Puedes reemplazar esta lógica con un filtro real si tienes datos por carpeta
        renderMessageList(messageListContainer, (id) => {
          renderPreview(previewContainer, id);
          renderDetails(detailsContainer, id);
          initMessageForm(detailsContainer);
        });
      });
      folderButtonsContainer.appendChild(btn);
    });
  }

  // Render mensajes y vista previa inicial
  renderMessageList(messageListContainer, (id) => {
    renderPreview(previewContainer, id);
    renderDetails(detailsContainer, id);
    initMessageForm(detailsContainer);
  });

  if (conversations.length > 0) {
    const firstId = conversations[0].id;
    renderPreview(previewContainer, firstId);
    renderDetails(detailsContainer, firstId);
    initMessageForm(detailsContainer);
  }
}
