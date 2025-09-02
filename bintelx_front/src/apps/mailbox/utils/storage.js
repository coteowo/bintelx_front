// bintelx_front/src/apps/mailbox/utils/storage.js
import { conversations as defaultConversations } from '../data.mock.js';

const STORAGE_KEY = 'mailbox_mensajes_simulados';

let perfilActivo = null;

/**
 * Guarda los mensajes en localStorage
 * @param {Array} mensajes
 */
export function guardarMensajes(mensajes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes));
  } catch (err) {
    console.error('[STORAGE] Error guardando mensajes:', err);
  }
}

/**
 * Carga mensajes desde localStorage o usa defaultConversations
 * @returns {Array} mensajes
 */
export function cargarMensajes() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      guardarMensajes(defaultConversations);
      return defaultConversations;
    }
    return JSON.parse(json);
  } catch (err) {
    console.error('[STORAGE] Error cargando mensajes:', err);
    return [];
  }
}

/**
 * Borra los mensajes guardados
 */
export function limpiarMensajes() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Perfil activo actual
 */
export function setPerfilActivo(perfil) {
  perfilActivo = perfil;
}

export function getPerfilActivo() {
  return perfilActivo;
}

/**
 * Filtra mensajes según perfil activo y carpeta
 * @param {String} carpeta - 'inbox' | 'sent' | 'todos'
 * @returns {Array} mensajes filtrados
 */
export function filtrarMensajes(mensajes = [], carpeta = 'inbox') {
  if (!perfilActivo || !perfilActivo.email) return [];

  return mensajes.filter(msg => {
    if (carpeta === 'inbox') {
      if (Array.isArray(msg.to)) return msg.to.includes(perfilActivo.email);
      return msg.to === perfilActivo.email;
    }
    if (carpeta === 'sent') {
      return msg.from === perfilActivo.email;
    }
    if (carpeta === 'todos') {
      const toMatch = Array.isArray(msg.to) ? msg.to.includes(perfilActivo.email) : msg.to === perfilActivo.email;
      return msg.from === perfilActivo.email || toMatch;
    }
    // fallback: mostrar todo
    return msg.from === perfilActivo.email || (Array.isArray(msg.to) ? msg.to.includes(perfilActivo.email) : msg.to === perfilActivo.email);
  });
}
