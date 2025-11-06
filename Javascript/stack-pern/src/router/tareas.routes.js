import Router from "express-promise-router";
import {
  listarTareas,
  listarTarea,
  crearTarea,
  actualizarTareas,
  eliminarTareas,
} from "../controllers/tareas.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createTareasSchema, updateTareasSchema } from "../schemas/tareas.schema.js";

const router = Router();

router.get("/tareas", isAuth, listarTareas);
router.get("/tareas/:id", isAuth, listarTarea);
router.post("/tareas", isAuth, validateSchema(createTareasSchema), crearTarea);
router.put("/tareas/:id", isAuth, validateSchema(updateTareasSchema), actualizarTareas);
router.delete("/tareas/:id", isAuth, eliminarTareas);

export default router;
