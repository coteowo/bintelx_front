// Importa los mensajes por defecto desde tu mock
import { conversations as defaultConversations } from '../data.mock.js';

// Clave usada para almacenar los mensajes en localStorage
const STORAGE_KEY = 'mailbox_mensajes_simulados';

/**
 * Guarda los mensajes en localStorage de forma persistente.
 * @param {Array} mensajes - Lista de mensajes a guardar.
 */
export function guardarMensajes(mensajes) {
  try {
    const json = JSON.stringify(mensajes);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Error guardando mensajes en localStorage:', error);
  }
}

/**
 * Carga los mensajes desde localStorage. Si no hay datos, usa los mensajes por defecto.
 * @returns {Array} Lista de mensajes.
 */
export function cargarMensajes() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      // Si no hay nada guardado, inicializa con los mensajes por defecto
      guardarMensajes(defaultConversations);
      return defaultConversations;
    }
    return JSON.parse(json);
  } catch (error) {
    console.error('Error cargando mensajes desde localStorage:', error);
    return [];
  }
}

/**
 * Borra los mensajes guardados en localStorage.
 */
export function limpiarMensajes() {
  localStorage.removeItem(STORAGE_KEY);
}



let perfilActivo = null;

export function setPerfilActivo(perfil) {
  perfilActivo = perfil;
}

export function getPerfilActivo() {
  return perfilActivo;
}
