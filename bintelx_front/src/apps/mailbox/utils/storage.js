import { conversations as defaultConversations } from '../data.mock.js';

const STORAGE_KEY = 'mailbox_mensajes_simulados';

export function guardarMensajes(mensajes) {
  try {
    const json = JSON.stringify(mensajes);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Error guardando mensajes en localStorage:', error);
  }
}

export function cargarMensajes() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      // Si no hay datos guardados, carga los mensajes por defecto
      guardarMensajes(defaultConversations);
      return defaultConversations;
    }
    return JSON.parse(json);
  } catch (error) {
    console.error('Error cargando mensajes desde localStorage:', error);
    return [];
  }
}

export function limpiarMensajes() {
  localStorage.removeItem(STORAGE_KEY);
}
