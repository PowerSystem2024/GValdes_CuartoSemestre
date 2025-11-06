import { Card, Input, Textarea, Label, Button } from "../components/ui";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTareas } from "../context/TareasContext";

function TareaFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const { crearTarea, cargarTarea, editarTarea, errors: tareasErrors } = useTareas();

  const onSubmit = handleSubmit(async (data) => {
    if (!params.id) {
      await crearTarea(data);
    } else {
      await editarTarea(params.id, data);
    }
    navigate("/tareas");
  });

  useEffect(() => {
    if (params.id) {
      cargarTarea(params.id).then((t) => {
        setValue("titulo", t.titulo);
        setValue("descripcion", t.descripcion);
      });
    }
  }, [params.id, cargarTarea, setValue]);

  return (
    <div className="flex min-h-[80vh] justify-center items-center">
      <Card className="w-full max-w-xl">
        {tareasErrors?.map((e, i) => (
          <p key={i} className="bg-rose-900/40 border border-rose-700 text-rose-200 px-3 py-2 mb-2 rounded-lg">{e}</p>
        ))}
        <h2 className="text-2xl md:text-3xl font-bold my-2 text-emerald-400 text-center">
          {params.id ? "Editar tarea" : "Nueva tarea"}
        </h2>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" placeholder="Ej. Preparar informe semanal"
              {...register("titulo", { required: true })}
            />
            {errors.titulo && <p className="text-amber-300 text-sm mt-1">El título es requerido</p>}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" placeholder="Detalles opcionales..." rows={4}
              {...register("descripcion")}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit">{params.id ? "Guardar cambios" : "Crear tarea"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
export default TareaFormPage;
