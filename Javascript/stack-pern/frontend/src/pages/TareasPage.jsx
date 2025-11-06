import { useEffect } from "react";
import { CardTareas } from "../components/tareas/CardTareas";
import { useTareas } from "../context/TareasContext";
import { Container } from "../components/ui";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function TareasPage() {
  const { tareas, cargarTareas } = useTareas();

  useEffect(() => { cargarTareas(); }, []);

  if (tareas.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-200">Aún no hay tareas</h1>
        <p className="text-slate-400 mt-2">Crea tu primera tarea para empezar.</p>
        <Link to="/tareas/crear" className="mt-6">
          <Button>Crear tarea</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tareas.map((t) => <CardTareas tarea={t} key={t.id} />)}
      </div>
    </Container>
  );
}
export default TareasPage;
