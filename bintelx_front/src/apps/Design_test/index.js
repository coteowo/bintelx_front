// src/apps/Design_test/index.js
import "./index.css"; 
import { renderPanel } from "./Panel_design/panel.js"; 

// Datos simples para la demo
const pageData = {
  header: {
    title: "Demo App",
    nav: ["Inicio", "Componentes", "Contacto"]
  },
  sections: [
    {
      type: "typography",
      title: "Tipografía",
      content: [
        "Este es un párrafo de ejemplo para comprobar la escala tipográfica, el line-height y el ancho de línea.",
        { text: "Texto secundario con menor contraste", class: "muted" }
      ]
    },
    {
      type: "buttons",
      title: "Botones",
      buttons: [
        { label: "Primary", class: "btn primary" },
        { label: "Secondary", class: "btn secondary" },
        { label: "Danger", class: "btn danger" }
      ]
    },
    {
      type: "inputs",
      title: "Inputs",
      inputs: [
        { type: "email", label: "Email", placeholder: "ejemplo@mail.com" },
        { type: "password", label: "Password", placeholder: "••••••••" }
      ],
      submit: { label: "Login", class: "btn primary" }
    },
    {
      type: "cards",
      title: "Cards",
      cards: [
        {
          title: "Título de la card",
          content: "Contenido dentro de una card. Sirve para validar sombras, radios y espaciado.",
          button: { label: "Acción", class: "btn secondary" }
        }
      ]
    },
    {
      type: "navigation",
      title: "Navegación",
      content: "Haz clic en el botón para ir al panel de opciones.",
      button: { label: "Ir al Panel", class: "btn primary go-panel" }
    }
  ],
  footer: "© 2025 Demo App"
};

// Función para renderizar una sección según su tipo
function renderSection(section) {
  const sec = document.createElement("section");
  sec.className = section.type;

  const h2 = document.createElement("h2");
  h2.textContent = section.title;
  sec.appendChild(h2);

  if (section.content) {
    if (Array.isArray(section.content)) {
      section.content.forEach(item => {
        const p = document.createElement("p");
        if (typeof item === "string") {
          p.textContent = item;
        } else {
          p.textContent = item.text;
          if (item.class) p.className = item.class;
        }
        sec.appendChild(p);
      });
    } else {
      const p = document.createElement("p");
      p.textContent = section.content;
      sec.appendChild(p);
    }
  }

  if (section.buttons) {
    section.buttons.forEach(btnData => {
      const btn = document.createElement("button");
      btn.className = btnData.class;
      btn.textContent = btnData.label;

      // Listener especial para el botón "Ir al Panel"
      if (btnData.class.includes("go-panel")) {
        btn.addEventListener("click", () => {
          console.log("Botón 'Ir al Panel' clickeado");
          alert("Botón clickeado, renderizando panel...");
          renderPanel("#app");
        });
      }

      sec.appendChild(btn);
    });
  }

  if (section.inputs) {
    section.inputs.forEach(inputData => {
      const label = document.createElement("label");
      label.textContent = inputData.label;
      const input = document.createElement("input");
      input.type = inputData.type;
      input.placeholder = inputData.placeholder;
      label.appendChild(input);
      sec.appendChild(label);
    });
    if (section.submit) {
      const submit = document.createElement("button");
      submit.className = section.submit.class;
      submit.textContent = section.submit.label;
      sec.appendChild(submit);
    }
  }

  if (section.cards) {
    section.cards.forEach(cardData => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${cardData.title}</h3><p>${cardData.content}</p>`;
      if (cardData.button) {
        const btn = document.createElement("button");
        btn.className = cardData.button.class;
        btn.textContent = cardData.button.label;
        card.appendChild(btn);
      }
      sec.appendChild(card);
    });
  }

  return sec;
}

// Renderiza la página completa
export function renderPage(containerSelector = "#app") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";

  // Header
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `<h1>${pageData.header.title}</h1><nav>${pageData.header.nav.map(item => `<a href="#">${item}</a>`).join("")}</nav>`;
  container.appendChild(header);

  // Main
  const main = document.createElement("main");
  main.className = "content";

  pageData.sections.forEach(section => {
    main.appendChild(renderSection(section));
  });

  container.appendChild(main);

  // Footer
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `<p>${pageData.footer}</p>`;
  container.appendChild(footer);

  console.log("Página principal renderizada correctamente");
}

// Inicializar al cargar DOM
document.addEventListener("DOMContentLoaded", () => {
  renderPage("#app");
  console.log("index.js cargado y renderPage ejecutada");
});
