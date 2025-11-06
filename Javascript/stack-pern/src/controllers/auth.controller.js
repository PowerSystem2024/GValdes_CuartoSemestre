import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import md5 from "md5";

/**
 * Inicia sesión de usuario y devuelve cookie con JWT
 */
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(400).json({ message: "El usuario no está registrado" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token con el ID del usuario
    const token = await createAccessToken({ id: user.id });

    // Setear cookie (en desarrollo)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // para que funcione entre localhost:3000 y 5173
      secure: false, // en producción: true con HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    console.log(`Usuario logueado: ${user.email} (ID: ${user.id})`);

    return res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gravatar: user.gravatar,
      },
      token,
    });
  } catch (error) {
    console.error("Error en signin:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Registro de usuario nuevo
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const gravatar = "https://gravatar.com/avatar/" + md5(email);

    // Guardar en la base de datos
    const result = await pool.query(
      "INSERT INTO usuarios (name, email, password, gravatar) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, gravatar]
    );

    const user = result.rows[0];
    const token = await createAccessToken({ id: user.id });

    // Setear cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log(`Usuario registrado: ${user.email} (ID: ${user.id})`);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gravatar: user.gravatar,
      },
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "El correo ya está registrado",
      });
    }

    console.error("Error inesperado en signup:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

/**
 * Cierra sesión eliminando la cookie del token
 */
export const signout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Cierre de sesión exitoso" });
};

/**
 * Devuelve el perfil del usuario autenticado
 */
export const profile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, gravatar, fecha_registro FROM usuarios WHERE id = $1",
      [req.usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
