import { Link } from "react-router-dom";
import { Card, Container } from "../components/ui";

function NotFound() {
  return (
    <Container className="h-[calc(100vh-64px)] flex justify-center items-center">
      <Card className="text-center">
        <h1 className="text-4xl font-bold my-2 text-emerald-400">404</h1>
        <h3 className="text-xl text-slate-200">Página no encontrada</h3>
        <Link to="/" className="text-emerald-400 hover:underline mt-2 inline-block">
          Volver al inicio
        </Link>
      </Card>
    </Container>
  );
}
export default NotFound;
