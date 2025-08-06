import { conversations } from '../data.mock.js';

export function setupFormEnviar(onEnviar) {
  const form = document.getElementById('form-enviar');

  if (!form) {
    console.warn('No se encontró el formulario con id "form-enviar" en el DOM');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario con validación simple
    const to = form.elements.to?.value?.trim();
    const subject = form.elements.subject?.value?.trim();
    const body = form.elements.body?.value?.trim();

    if (!to || !subject || !body) {
      alert('Por favor completa todos los campos del formulario.');
      return;
    }

    const nuevoMensaje = {
      id: Date.now(),
      from: 'yo@miapp.com', // o el usuario actual si usas autenticación
      to,
      subject,
      body,
      category: 'sent', // Categoría enviados
    };

    // Agregar el mensaje a la lista
    conversations.push(nuevoMensaje);

    console.log('Nuevo mensaje agregado:', nuevoMensaje);

    // Llamar el callback para refrescar UI, si existe
    if (typeof onEnviar === 'function') onEnviar(nuevoMensaje);

    form.reset();
    alert('Mensaje enviado correctamente');
  });
}
