// src/apps/login/login.js

import loginData from './login.mock.js';
import "./index.css";


export function initLogin() {
  const container = document.querySelector('.auth-container');
  if (!container) return;

  const auth = loginData.auth;

  // Tabs
  const tabs = container.querySelectorAll('[data-auth-tab]');
  tabs.forEach((tab, index) => {
    tab.textContent = auth.tabs[index].label;
  });

  // Botones sociales
  const socialButtons = container.querySelectorAll('.btn-social img');
  socialButtons.forEach((img, index) => {
    img.src = auth.socialButtons[index].icon;
    img.alt = auth.socialButtons[index].provider;
  });

  // Botón biometría
  const biometricBtn = container.querySelector('[data-auth-provider="cifrid"]');
  if (biometricBtn) {
    biometricBtn.querySelector('img').src = auth.biometric.icon;
    biometricBtn.querySelector('span').textContent = auth.biometric.label;
  }

  // Teléfono
  const phoneSelect = container.querySelector('select');
  const phoneInput = container.querySelector('input[type="tel"]');
  if (phoneSelect) {
    phoneSelect.innerHTML = `<option value="${auth.phone.prefix}" selected>${auth.phone.flag} ${auth.phone.prefix}</option>`;
  }
  if (phoneInput) {
    phoneInput.placeholder = auth.phone.placeholder;
  }

  // Clave
  const passInput = container.querySelector('input[type="password"]');
  if (passInput) {
    passInput.placeholder = auth.passwordPlaceholder;
  }

  // Recordarme
  const rememberLabel = container.querySelector('label');
  if (rememberLabel) {
    rememberLabel.lastChild.textContent = " " + auth.rememberLabel;
  }

  // Olvidé mi contraseña
  const forgotLink = container.querySelector('a[href="#/auth/reset"]');
  if (forgotLink) {
    forgotLink.href = auth.forgotLink;
    forgotLink.textContent = auth.forgotLabel;
  }

  // Botón Login
  const loginBtn = container.querySelector('button.bg-primary');
  if (loginBtn) {
    loginBtn.textContent = auth.loginButton;
  }
}
document.querySelectorAll('.segment').forEach(btn => {
  btn.addEventListener('click', () => {
    // Desactivar todos
    document.querySelectorAll('.segment').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));

    // Activar el actual
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.remove('hidden');
  });
});
