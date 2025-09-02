import { cargarMensajes, guardarMensajes } from '../utils/storage.js';
import { getCurrentDebugProfile } from '../_debug/debug.js';

 // FORM AQUI SE ENVIAN LOS MENSAJES DE VERDA
export function setupFormEnviar(onEnviar) {
  const form = document.getElementById('form-enviar');

  if (!form) {
    console.warn('No se encontró el formulario con id "form-enviar" en el DOM');
    return;
  }

  // 🔥 Eliminar cualquier submit listener previo para no duplicar envíos
  form.replaceWith(form.cloneNode(true));
  const newForm = document.getElementById('form-enviar');

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const to = newForm.elements.to?.value?.trim();
    const subject = newForm.elements.subject?.value?.trim();
    const body = newForm.elements.body?.value?.trim();

    if (!to || !subject || !body) {
      alert('Por favor completa todos los campos del formulario.');
      return;
    }

    const mensajes = cargarMensajes();

    const nuevoMensaje = {
      id: Date.now(),
      from: getCurrentDebugProfile(),
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

    newForm.reset();
    alert('Mensaje enviado correctamente');
  });
}
