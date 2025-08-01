// src/apps/mailbox/data.mock.js

export const folders = [
  { name: "Bandeja de Entrada", count: 12 },
  { name: "Enviados", count: 5 },
  { name: "Spam", count: 1 },
  { name: "Papelera", count: 0 },
];

export const conversations = [
  {
    id: 1,
    from: "maria@ejemplo.com",
    subject: "Reunión del lunes",
    preview: "Hola, te escribo para confirmar la hora de la reunión...",
    date: "31/07",
    unread: true,
  },
  {
    id: 2,
    from: "soporte@tienda.cl",
    subject: "Factura disponible",
    preview: "Tu factura de compra está lista para descargar.",
    date: "30/07",
    unread: false,
  },
  {
    id: 3,
    from: "eventos@empresa.com",
    subject: "Invitación al seminario",
    preview: "Estás cordialmente invitado al evento anual...",
    date: "29/07",
    unread: true,
  },
];

export const selectedMessage = {
  id: 1,
  from: "maria@ejemplo.com",
  to: "coteowo@mail.com",
  subject: "Reunión del lunes",
  body: `
    <p>Hola,</p>
    <p>Te escribo para confirmar que la reunión será a las <strong>10:00 AM</strong> el lunes.</p>
    <p>Saludos cordiales,<br>María</p>
  `,
  date: "31/07",
};

export const actions = [
  { label: "Responder", icon: "↩", action: "reply" },
  { label: "Reenviar", icon: "🔁", action: "forward" },
  { label: "Eliminar", icon: "🗑", action: "delete" },
];
