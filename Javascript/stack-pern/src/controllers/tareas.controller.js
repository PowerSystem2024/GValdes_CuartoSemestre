import { pool } from "../db.js";

/**
 * Devuelve TODAS las tareas del usuario autenticado
 */
export const listarTareas = async (req, res) => {
  try {
    const { usuarioId } = req;
    // Aseguramos que tenga usuario
    if (!usuarioId) return res.status(401).json({ message: "No autorizado" });

    const result = await pool.query(
      `SELECT id, titulo, descripcion
       FROM tareas
       WHERE usuario_id = $1
       ORDER BY id DESC`,
      [usuarioId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return res.status(500).json({ message: "Error al obtener tareas" });
  }
};

/**
 * Devuelve UNA tarea del usuario autenticado
 */
export const listarTarea = async (req, res) => {
  try {
    const { usuarioId } = req;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, titulo, descripcion
       FROM tareas
       WHERE id = $1 AND usuario_id = $2`,
      [id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener tarea:", error);
    return res.status(500).json({ message: "Error al obtener tarea" });
  }
};

/**
 * Crea una tarea para el usuario autenticado
 */
export const crearTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;
    const { usuarioId } = req;

    const result = await pool.query(
      `INSERT INTO tareas (titulo, descripcion, usuario_id)
       VALUES ($1, $2, $3)
       RETURNING id, titulo, descripcion`,
      [titulo, descripcion ?? null, usuarioId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    // título único
    if (error.code === "23505") {
      return res.status(400).json({ message: "Ya existe una tarea con ese título" });
    }
    // FK usuario no existe
    if (error.code === "23503") {
      return res.status(400).json({ message: "Usuario inválido para la tarea" });
    }
    console.error("Error al crear tarea:", error);
    return res.status(500).json({ message: "Error al crear tarea" });
  }
};

/**
 * Actualiza una tarea del usuario autenticado
 */
export const actualizarTareas = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const { usuarioId } = req;

    const result = await pool.query(
      `UPDATE tareas
       SET titulo = $1, descripcion = $2
       WHERE id = $3 AND usuario_id = $4
       RETURNING id, titulo, descripcion`,
      [titulo, descripcion ?? null, id, usuarioId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No existe una tarea con ese id" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Ya existe una tarea con ese título" });
    }
    console.error("Error al actualizar tarea:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Elimina una tarea del usuario autenticado
 */
export const eliminarTareas = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req;

    const result = await pool.query(
      `DELETE FROM tareas
       WHERE id = $1 AND usuario_id = $2`,
      [id, usuarioId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No existe una tarea con ese id" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
