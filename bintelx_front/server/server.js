// bintelx_front/server/server.js

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");

// Crear app de express
const app = express();
const PORT = process.env.PORT || 3001;

// =======================
// 🔧 Middlewares
// =======================
app.use(express.json());
app.use(cors());

// =======================
// 📦 Conexión a SQLite
// =======================
const db = new sqlite3.Database("./mailbox.db", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// =======================
// 📩 Tabla de correos
// =======================
db.run(`
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// =======================
// 👤 Tabla de usuarios
// =======================
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// =======================
// 👤 Rutas de usuarios
// =======================

// Registro de usuario
// Registro de usuario
app.post("/api/users/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Objeto que va a la base de datos
  const newUser = { username, email, password: hashedPassword };
  console.log("📥 Objeto recibido para BD:", newUser);

  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "El correo ya está registrado" });
        }
        return res.status(500).json({ error: err.message });
      }

      // Después de registrar, obtener todos los usuarios
      db.all(`SELECT id, username, email, created_at FROM users`, [], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({
          registrado: { id: this.lastID, username, email },
          objetoGuardado: newUser,
          todosLosUsuarios: rows
        });
      });
    }
  );
});


// Login de usuario
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ id: user.id, username: user.username, email: user.email, message: "Login exitoso" });
  });
});

// (Opcional) Obtener todos los usuarios (debug)
app.get("/api/users", (req, res) => {
  db.all(`SELECT id, username, email, created_at FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// =======================
// 📩 Rutas de Mailbox API
// =======================

// Guardar un correo
app.post("/api/messages/send", (req, res) => {
  const { sender, recipient, subject, body } = req.body;

  if (!sender || !recipient) {
    return res.status(400).json({ error: "Sender and recipient are required" });
  }

  db.run(
    `INSERT INTO emails (sender, recipient, subject, body) VALUES (?, ?, ?, ?)`,
    [sender, recipient, subject || "", body || ""],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: "Email saved successfully" });
      }
    }
  );
});

// Obtener correos
app.get("/api/messages", (req, res) => {
  const { perfil, category } = req.query;

  let query = "SELECT * FROM emails";
  const params = [];

  if (perfil && category === "inbox") {
    query += " WHERE recipient = ?";
    params.push(perfil);
  } else if (perfil && category === "sent") {
    query += " WHERE sender = ?";
    params.push(perfil);
  }

  query += " ORDER BY timestamp DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener un correo específico
app.get("/emails/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM emails WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Email not found" });
    res.json(row);
  });
});

// =======================
// 🚀 Iniciar servidor
// =======================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`📡 API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
