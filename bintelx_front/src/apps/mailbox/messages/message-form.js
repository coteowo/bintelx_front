import { cargarMensajes, guardarMensajes } from '../utils/storage.js';
import { getCurrentDebugProfile } from '../_debug/debug.js';

 // FORM AQUI SE ENVIAN LOS MENSAJES DE VERDA
export function setupFormEnviar(onEnviar) {
  const form = document.getElementById('form-enviar');

  if (!form) {
    console.warn('No se encontró el formulario con id "form-enviar" en el DOM');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const to = form.elements.to?.value?.trim();
    const subject = form.elements.subject?.value?.trim();
    const body = form.elements.body?.value?.trim();

    if (!to || !subject || !body) {
      alert('Por favor completa todos los campos del formulario.');
      return;
    }

    const mensajes = cargarMensajes();

    const nuevoMensaje = {
      id: Date.now(),
      from: getCurrentDebugProfile(),  // aquí está el cambio clave
      to,
      subject,
      body,
      category: 'sent',
      date: new Date().toISOString().slice(0, 10),
      unread: false,
    };

    mensajes.push(nuevoMensaje);
    guardarMensajes(mensajes);

    console.log('Nuevo mensaje agregado:', nuevoMensaje);

    if (typeof onEnviar === 'function') onEnviar(nuevoMensaje);

    form.reset();
    alert('Mensaje enviado correctamente');
  });
}