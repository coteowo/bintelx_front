import loginData from './login.mock.js';
import "./index.css";
import bcrypt from "bcryptjs"; // si usas npm

export default function initLogin(container, data = {}) {
  if (!container) return;

  const auth = loginData.auth;

  // Inicializar textos de tabs
  const tabs = container.querySelectorAll('.segment');
  tabs.forEach((tab, index) => {
    if (auth.tabs[index]) tab.textContent = auth.tabs[index].label;
  });

  // Inicializar botones sociales
  const socialButtons = container.querySelectorAll('.social-buttons .btn-social img');
  socialButtons.forEach((img, index) => {
    if (auth.socialButtons[index]) {
      img.src = auth.socialButtons[index].icon;
      img.alt = auth.socialButtons[index].provider;
    }
  });

  // Botón biometría CIFRID
  const biometricBtn = container.querySelector('[data-auth-provider="cifrid"]');
  if (biometricBtn && auth.biometric) {
    biometricBtn.querySelector('img').src = auth.biometric.icon;
    biometricBtn.querySelector('span').textContent = auth.biometric.label;
  }

  // Teléfono
  const phoneSelect = container.querySelector('select');
  const phoneInput = container.querySelector('input[type="tel"]');
  if (phoneSelect && auth.phone) {
    phoneSelect.innerHTML = `<option value="${auth.phone.prefix}" selected>${auth.phone.flag} ${auth.phone.prefix}</option>`;
  }
  if (phoneInput && auth.phone) {
    phoneInput.placeholder = auth.phone.placeholder;
  }

  // Clave
  const passInput = container.querySelector('input[type="password"]');
  if (passInput) passInput.placeholder = auth.passwordPlaceholder;

  // Recordarme
  const rememberLabel = container.querySelector('label.remember');
  if (rememberLabel) {
    rememberLabel.lastChild.textContent = " " + auth.rememberLabel;
  }

  // Olvidé mi contraseña
  const forgotLink = container.querySelector('a.forgot');
  if (forgotLink) {
    forgotLink.href = auth.forgotLink;
    forgotLink.textContent = auth.forgotLabel;
  }

  // Botón login
  const loginBtn = container.querySelector('button.btn-login');
  if (loginBtn) loginBtn.textContent = auth.loginButton;

  // 🔹 Control de tabs login / register
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      // Desactivar todos los tabs
      tabs.forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));

      // Activar tab clickeado
      btn.classList.add('active');
      const target = container.querySelector(`#${btn.dataset.tab}`);
      if (target) target.classList.remove('hidden');
    });
  });

  // 🔹 Abrir pestaña inicial según data
  if (data.authType === 'register') {
    const registerTab = container.querySelector('.segment[data-tab="register"]');
    if (registerTab) registerTab.click();
  }

  // ✅ Botón registro dentro de initLogin
const registerBtn = container.querySelector("#btn-register");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const username = container.querySelector("#reg-username").value.trim();
    const email = container.querySelector("#reg-email").value.trim();
    const password = container.querySelector("#reg-password").value;

    if (!username || !email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      // 🔹 Consultar usuarios existentes
      const resUsers = await fetch("http://localhost:3001/api/users");
      const existingUsers = await resUsers.json();

      // 🔹 Validar username y email
      const usernameExists = existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
      const emailExists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (usernameExists) {
        alert("El nombre de usuario ya existe, elige otro");
        return;
      }
      if (emailExists) {
        alert("El correo ya está registrado");
        return;
      }

      // 🔹 Enviar registro al backend
      const newUser = { username, email, password };
      console.log("📤 Enviando usuario al backend:", newUser);

      const res = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error en el registro");

      console.log("✅ Respuesta backend:", data);
      alert("Registro exitoso");
    } catch (err) {
      console.error(err);
      alert("Error al registrar usuario: " + err.message);
    }
  });
}

}
