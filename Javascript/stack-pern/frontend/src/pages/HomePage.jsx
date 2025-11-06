import { Card, Container } from "../components/ui";

function HomePage() {
  return (
    <Container className="py-10">
      <Card>
        <h1 className="font-bold text-center text-3xl md:text-4xl text-emerald-400 py-2">
          Gestor de Tareas con PERN
        </h1>
        <p className="mt-4 leading-relaxed text-slate-300 text-justify">
          Una base sólida para crear, editar y organizar tareas con autenticación y API REST.
          La interfaz busca claridad y foco en el contenido, con un estilo oscuro agradable y discreto.
        </p>
      </Card>
    </Container>
  );
}
export default HomePage;
