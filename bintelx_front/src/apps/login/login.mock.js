// bintelx_front/src/apps/login/login.mock.js

export default {
  auth: {
    tabs: [
      { label: "Ingresar" },
      { label: "Registrarme" }
    ],
    socialButtons: [
      { provider: "google", icon: "/assets/icons/google.svg" },
      { provider: "facebook", icon: "/assets/icons/facebook.svg" }
    ],
    biometric: {
      icon: "/assets/icons/biometric.svg",
      label: "Ingresar con biometría"
    },
    phone: {
      flag: "🇨🇱",
      prefix: "+56",
      placeholder: "9 1234 5678"
    },
    passwordPlaceholder: "Clave",
    rememberLabel: "Recuérdame",
    forgotLabel: "Olvidé mi contraseña",
    forgotLink: "#/auth/reset",
    loginButton: "Iniciar sesión"
  }
};
