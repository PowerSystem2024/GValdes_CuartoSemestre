import { Card, Button } from "../ui";
import { useTareas } from "../../context/TareasContext";
import { useNavigate } from "react-router-dom";
import { PiTrashSimpleLight, PiPencil } from "react-icons/pi";

export function CardTareas({ tarea }) {
  const { eliminarTarea } = useTareas();
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col justify-between p-6 border border-slate-800/70 shadow hover:shadow-lg transition">
      <div>
        <h2 className="text-xl font-semibold text-emerald-400 mb-1">
          {tarea.titulo}
        </h2>
        <p className="text-slate-300 whitespace-pre-wrap">
          {tarea.descripcion || "Sin descripción"}
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <Button onClick={() => navigate(`/tareas/${tarea.id}/editar`)}>
          <PiPencil className="mr-1" />
          Editar
        </Button>

        <Button
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
          onClick={async () => {
            if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
              await eliminarTarea(tarea.id);
            }
          }}
        >
          <PiTrashSimpleLight className="mr-1" />
          Eliminar
        </Button>
      </div>
    </Card>
  );
}

export default CardTareas;
