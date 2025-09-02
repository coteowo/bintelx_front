// bintelx_front/src/apps/mailbox/_debug/debug.js

// Perfiles simulados
const debugProfiles = [
  { id: 'polnareff@example.com', name: 'Mail 1' },
  { id: 'coteowo@example.com', name: 'Mail 2' },
];

// Estado actual
let currentDebugProfile = debugProfiles[0].id;

// Retorna el objeto completo del perfil activo con .email
function getCurrentProfileObject() {
  const profile = debugProfiles.find(p => p.id === currentDebugProfile);
  if (!profile) return null;
  return { email: profile.id, name: profile.name }; // ahora tiene .email
}

// Panel de depuración
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

  // Valor inicial
  select.value = currentDebugProfile;

  // Visualización del perfil activo
  const profileDisplay = document.createElement('div');
  profileDisplay.classList.add('active-profile-display');
  profileDisplay.style.fontWeight = 'bold';
  profileDisplay.textContent = `Perfil activo: ${getCurrentProfileObject().name} (${currentDebugProfile})`;

  // Cambio de perfil
  select.addEventListener('change', (e) => {
    currentDebugProfile = e.target.value;
    console.log('[DEBUG] Perfil seleccionado:', currentDebugProfile);

    const activeProfile = getCurrentProfileObject();
    profileDisplay.textContent = `Perfil activo: ${activeProfile.name} (${activeProfile.email})`;

    if (typeof onProfileChangeCallback === 'function') {
      onProfileChangeCallback(activeProfile);
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
      onRefreshCallback(getCurrentProfileObject());
    }
  });

  // Montar todo en el toolbar
  debugToolbar.appendChild(label);
  debugToolbar.appendChild(select);
  debugToolbar.appendChild(profileDisplay);
  debugToolbar.appendChild(btn);

  container.appendChild(debugToolbar);
}

// Exportar perfil actual completo con .email
export function getCurrentDebugProfile() {
  return getCurrentProfileObject();
}
