// bintelx_front/src/apps/mailbox/_debug/debug.js

// Perfiles simulados
const debugProfiles = [
  { id: 'polnareff@example.com', name: 'Mail 1' },
  { id: 'coteowo@example.com', name: 'Mail 2' },
];

// Estado actual
let currentDebugProfile = debugProfiles[0].id;

function getCurrentProfileObject() {
  return debugProfiles.find(p => p.id === currentDebugProfile);
}

// Función principal del panel
export function initDebugPanel(container, onRefreshCallback, onProfileChangeCallback) {
  container.innerHTML = '';
  const debugToolbar = document.createElement('div');
  debugToolbar.classList.add('debug-toolbar');
  debugToolbar.style.display = 'flex';
  debugToolbar.style.flexDirection = 'column';
  debugToolbar.style.gap = '0.5rem';

  // Label
  const label = document.createElement('label');
  label.textContent = 'Selecciona un perfil de correo:';
  label.setAttribute('for', 'profile-select');

  // Selector de perfiles
  const select = document.createElement('select');
  select.id = 'profile-select';
  select.classList.add('debug-profile-select');

  debugProfiles.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.name;
    select.appendChild(option);
  });

  // Establecer valor inicial
  select.value = currentDebugProfile;

  // Visualización del perfil activo
  const profileDisplay = document.createElement('div');
  profileDisplay.classList.add('active-profile-display');
  profileDisplay.style.fontWeight = 'bold';
  profileDisplay.textContent = `Perfil activo: ${getCurrentProfileObject().name} (${currentDebugProfile})`;

  // Evento de cambio de perfil
  select.addEventListener('change', (e) => {
    currentDebugProfile = e.target.value;
    console.log('[DEBUG] Perfil seleccionado:', currentDebugProfile);
    profileDisplay.textContent = `Perfil activo: ${getCurrentProfileObject().name} (${currentDebugProfile})`;

    if (typeof onProfileChangeCallback === 'function') {
      onProfileChangeCallback(currentDebugProfile);
    }
  });

  // Botón refrescar
  const btn = document.createElement('button');
  btn.classList.add('btn', 'refresh-btn');
  btn.textContent = '🔄 Refrescar';
  btn.title = 'Actualizar mensajes del perfil actual';

  btn.addEventListener('click', () => {
    console.log('[DEBUG] Botón refrescar presionado. Perfil actual:', currentDebugProfile);
    if (typeof onRefreshCallback === 'function') {
      onRefreshCallback(currentDebugProfile);
    }
  });

  // Montar todo en el toolbar
  debugToolbar.appendChild(label);
  debugToolbar.appendChild(select);
  debugToolbar.appendChild(profileDisplay);
  debugToolbar.appendChild(btn);

  container.appendChild(debugToolbar);
}

// Exportar perfil actual
export function getCurrentDebugProfile() {
  return currentDebugProfile;
}
