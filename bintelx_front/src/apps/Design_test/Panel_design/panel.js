// panel.js
import "./panel.css";
import { renderPage } from "../index.js"; // función para volver a la página principal

// Renderiza la vista del panel en el contenedor
export function renderPanel(containerSelector = "#app") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  console.log("Renderizando panel...");

  // Limpiar contenedor
  container.innerHTML = `
    <div class="app-layout">
      <!-- Panel izquierdo -->
      <aside class="sidebar">
        <h2 class="sidebar-title">Opciones</h2>
        <nav class="sidebar-nav">
          <button class="sidebar-item active" data-section="dashboard">📊 Dashboard</button>
          <button class="sidebar-item" data-section="users">👤 Usuarios</button>
          <button class="sidebar-item" data-section="settings">⚙️ Configuración</button>
          <button class="sidebar-item" data-section="reports">📑 Reportes</button>
          <button class="sidebar-item danger" data-section="logout">🚪 Salir</button>
        </nav>
      </aside>

      <!-- Contenido principal -->
      <main class="main-content">
        <header class="main-header">
          <h1>Panel de Control</h1>
        </header>

        <section id="dashboard" class="section-content">
          <h2>Bienvenido</h2>
          <p>Selecciona una opción en el panel izquierdo para continuar.</p>
          <button class="btn secondary go-back">⬅ Volver a Inicio</button>
        </section>

        <section id="users" class="section-content hidden">
          <h2>Gestión de Usuarios</h2>
          <p>Contenido de usuarios aquí...</p>
        </section>

        <section id="settings" class="section-content hidden">
          <h2>Configuración</h2>
          <p>Opciones de configuración aquí...</p>
        </section>

        <section id="reports" class="section-content hidden">
          <h2>Reportes</h2>
          <p>Listado de reportes aquí...</p>
        </section>
      </main>
    </div>
  `;

  // Iniciar listeners del panel
  initPanel(containerSelector);

  // Listener para botón "Volver a Inicio"
  const backBtn = container.querySelector(".go-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      console.log("Botón 'Volver a Inicio' clickeado");
      alert("Volviendo a la página principal...");
      renderPage(containerSelector);
    });
  }
}

// Inicializa la lógica del panel (botones y tabs)
export function initPanel(containerSelector = ".app-layout") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const sidebarItems = container.querySelectorAll(".sidebar-item");
  const sections = container.querySelectorAll(".section-content");

  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      console.log("Sidebar clickeado:", item.dataset.section);

      // Resetear estados
      sidebarItems.forEach(btn => btn.classList.remove("active"));
      sections.forEach(sec => sec.classList.add("hidden"));

      // Activar el actual
      item.classList.add("active");
      const targetId = item.dataset.section;
      const targetSection = container.querySelector(`#${targetId}`);
      if (targetSection) targetSection.classList.remove("hidden");
    });
  });
}
