# Bintelx Front - Mailbox Module Technical Guide

Este documento describe la arquitectura, módulos y principios de desarrollo del módulo `mailbox` dentro del framework `bintelx_front`. Está destinado a desarrolladores que contribuyen o mantienen la funcionalidad de mailbox.

---

## Overview

El módulo `mailbox` es un **SPA modular** que simula operaciones de correo electrónico:

* Bandeja de entrada, mensajes enviados, composición de mensajes y acciones de debug.
* Uso de **Vanilla JS ES Modules** para la lógica y comunicación entre módulos.
* **Renderizado dinámico de componentes** mediante `loadComponent`.
* **API mockup** para desarrollo y pruebas rápidas.
* Componentes modulares para **mensajes, folders y panel de detalles**.

**⚠️ Nota Importante:** Antes de iniciar la app, **hay que iniciar la base de datos SQLite** para que el almacenamiento de mensajes funcione correctamente.

---

## Directory Structure

```
src/apps/mailbox/
├── folders/
│   └── index.js          # Sidebar y renderizado de carpetas
├── messages/
│   └── index.js          # Renderizado de lista de mensajes
├── details/
│   ├── index.js          # Panel de detalles del mensaje
│   └── message-form.js   # Formulario para componer mensajes
├── _debug/
│   └── debug.js          # Utilidades de debug
├── utils/
│   └── storage.js        # Utilidades de almacenamiento de mensajes (SQLite)
└── data.mock.js          # Datos y acciones mockeadas
```

---

## Core Components

### 1. Sidebar (Folders)

* **File:** `folders/index.js`
* **Purpose:** Renderiza carpetas (`Inbox`, `Sent`, `Dashboard`, `Stats`, `Help`, `New`, `Debug`) y maneja selección activa.
* **Key Features:**

  * Resalta la carpeta activa.
  * Botones especiales (`New` → enviar mensaje, `Debug` → acciones de depuración).
  * Selecciona automáticamente la primera carpeta con `categoryFilter` al cargar.
* **Important Function:** `renderFolders(container, onFolderSelect)`

---

### 2. Messages List

* **File:** `messages/index.js`
* **Purpose:** Renderiza mensajes filtrados según la carpeta activa.
* **Key Features:**

  * Recibe `perfilActivo` y mensajes prefiltrados.
  * Resalta el mensaje seleccionado.
  * Muestra estado vacío si no hay mensajes.
* **Important Function:** `renderMessageList(container, onSelect, mensajes, perfilActivo)`

---

### 3. Message Details

* **File:** `details/index.js`
* **Purpose:** Muestra metadatos, cuerpo del mensaje, botones de acción y formulario de respuesta/composición.
* **Key Features:**

  * Muestra remitente, asunto, fecha y botones de acción.
  * Renderiza el formulario de respuesta o mensaje nuevo mediante `message-form.js`.
  * Panel con animación de **desplazamiento/despliegue** (`#mailbox-details-panel.collapsed`) usando transición `transform` y `opacity`.
* **Important Function:** `renderDetails(container, message, onSendCallback)`

---

### 4. Message Form

* **File:** `details/message-form.js`
* **Purpose:** Maneja composición de nuevos mensajes y respuestas.
* **Key Features:**

  * Campos **To**, **Subject**, **Body**.
  * Botón enviar dispara `onSendCallback` con los datos del mensaje.
  * Soporta envío con tecla Enter.
  * Siempre muestra el formulario completo para mensajes nuevos.
* **Important Function:** `initMessageForm(container, message, onSendCallback)`

---

## CSS y Estilos

Todos los paneles siguen **principios Bintelx**: jerarquía visual clara, colores suaves, espaciado consistente y soporte responsive.

### Panel Details (Detalles del mensaje)

```css
#mailbox-details-panel {
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border-left: 1px solid #e5e7eb;
  height: 100vh;
  width: 15%;
  max-width: 150px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 1rem;
  box-shadow: -2px 0 8px rgba(0,0,0,0.05);
  z-index: 10;
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
}
#mailbox-details-panel.collapsed {
  transform: translateX(100%);
  opacity: 0;
  width: 0;
  padding: 0;
  overflow: hidden;
}
```

### Botones de Carpetas

```css
.btn-folder {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  color: #202124;
  border-radius: 1rem;
  transition: background-color 0.2s ease;
}
.btn-folder:hover { background-color: #f1f3f4; }
.btn-folder.active {
  background-color: #e8f0fe;
  color: #1967d2;
  font-weight: 500;
}
```

### Contenedor Principal Mailbox

```css
.mailbox-app {
  display: grid;
  grid-template-columns: 0.5fr 3fr 0.7fr;
  gap: 0.4rem;
  height: 100vh;
  background-color: #f8f9fa;
}
.panel-inbox-preview {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  height: 100%;
  background-color: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
}
#mailbox-panel-list { width: 33%; display: flex; flex-direction: column; min-height: 0; border-right: 1px solid #e5e7eb; }
#mailbox-panel-preview { width: 67%; display: flex; flex-direction: column; min-height: 0; }
.card1-scroll, #mailbox-preview { flex-grow:1; overflow-y:auto; min-height:0; }
```

---

## Data Flow

1. **Selección de carpeta:**

   * `renderFolders` llama a `onFolderSelect(category)`.
   * La carpeta seleccionada filtra los mensajes mostrados en `renderMessageList`.

2. **Selección de mensaje:**

   * Al hacer click en un mensaje se dispara `onSelect(messageId)`.
   * El mensaje seleccionado se pasa a `renderDetails`.

3. **Envio de mensaje:**

   * Los datos del mensaje se pasan a `onSendCallback`.
   * Mensajes guardados en **SQLite** mediante `storage.js`.
   * Formato de mensaje:

```json
{
  "id": "uuid",
  "from": "user@example.com",
  "to": "recipient@example.com",
  "subject": "Subject",
  "body": "Message body",
  "date": "2025-08-25T10:00:00Z",
  "actions": [
    { "action": "reply", "icon": "↩️", "label": "Reply" },
    { "action": "delete", "icon": "🗑️", "label": "Delete" }
  ]
}
```

---

## Debugging y Desarrollo

* `_debug/debug.js` permite simular perfiles activos y probar renderizado de mensajes.
* `data.mock.js` contiene acciones y mensajes mockeados.
* Usar `console.log` para verificar `perfilActivo`, carpeta seleccionada y mensajes renderizados.

---

## Future Improvements

* Integración con backend real para envío/recepción de mensajes.
* Mejorar UI según tokens de diseño global.
* Implementar tests unitarios e integrales.

---

## Notas Finales

* Renderizado **modular**: folders, mensajes y panel de detalles independientes.
* Principio **feature-first**: prioridad a acción principal (selección/envío) sobre estética.
* Mensajes filtrables por categoría; selección por defecto garantiza carpeta activa.
* **⚠️ Recordatorio crítico:** Inicializar primero la **base de datos SQLite** antes de arrancar la app de mailbox para que todos los datos y paneles funcionen correctamente.
