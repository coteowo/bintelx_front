// src/apps/mailbox/data.mock.js

export const folders = [
  { name: "Bandeja de Entrada", count: 12 },
  { name: "Enviados", count: 5 },
  { name: "Spam", count: 1 },
  { name: "Papelera", count: 0 },
];

export const conversations = [
  {
    id: 'msg-124',
    from: 'ana@example.com',
    to: 'juan@example.com',
    subject: 'Reunión de trabajo',
    body: 'Hola Juan, te confirmo la reunión para el martes a las 10:00 am. Saludos.',
    preview: 'Hola Juan, te confirmo la reunión...',
    date: '2025-08-04',
    unread: false,
    category: 'work'
  },
  {
    id: 'msg-125',
    from: 'sofia@example.com',
    to: 'maria@example.com',
    subject: 'Cumpleaños este fin de semana',
    body: 'María, ¿vas a ir a la fiesta de cumpleaños el sábado? Avísame para coordinar.',
    preview: 'María, ¿vas a ir a la fiesta...',
    date: '2025-08-03',
    unread: true,
    category: 'personal'
  },
  {
    id: 'msg-126',
    from: 'soporte@servicio.com',
    to: 'juan@example.com',
    subject: 'Actualización de sistema',
    body: 'Estimado usuario, se realizará una actualización del sistema el domingo a las 2 am.',
    preview: 'Estimado usuario, se realizará...',
    date: '2025-08-02',
    unread: false,
    category: 'notifications'
  },
  {
    id: 'msg-123',
    from: 'juan@example.com',
    to: 'maria@example.com',
    subject: 'Hola!',
    body: 'Este es el contenido completo del mensaje...',
    preview: 'Este es un resumen...',
    date: '2025-08-05',
    unread: true,
    category: 'personal'
  },
  {
    id: 'msg-127',
    from: 'noreply@empresa.com',
    to: 'maria@example.com',
    subject: 'Boletín semanal',
    body: 'Este es el boletín semanal con novedades importantes.',
    preview: 'Este es el boletín semanal...',
    date: '2025-08-01',
    unread: false,
    category: 'general'
  },
  {
    id: 'msg-128',
    from: 'contacto@universidad.cl',
    to: 'juan@example.com',
    subject: 'Información Académica',
    body: 'Recuerda completar tu inscripción antes del viernes.',
    preview: 'Recuerda completar tu inscripción...',
    date: '2025-07-31',
    unread: true,
    category: 'general'
  }
];


export const actions = [
  { label: "Responder", icon: "↩", action: "reply" },
  { label: "Reenviar", icon: "🔁", action: "forward" },
  { label: "Eliminar", icon: "🗑", action: "delete" },
];
