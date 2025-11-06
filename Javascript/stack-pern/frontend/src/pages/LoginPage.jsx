import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Card, Label, Container } from "../components/ui";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);
    if (user) navigate("/tareas");
  });

  return (
    <Container className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        {loginErrors && loginErrors.map((err, i) => (
          <p key={i} className="bg-rose-900/40 border border-rose-700 text-rose-200 px-3 py-2 mb-2 rounded-lg">
            {err}
          </p>
        ))}
        <h3 className="text-3xl font-bold text-center text-emerald-400 my-6">Iniciar sesión</h3>
        <form onSubmit={onSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email" type="email" placeholder="tu@email.com"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="text-amber-300 text-sm mb-2">Email es requerido</p>}

          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password" type="password" placeholder="••••••••"
            {...register("password", { required: true })}
          />
          {errors.password && <p className="text-amber-300 text-sm mb-2">Contraseña es requerida</p>}

          <div className="flex justify-center mt-6">
            <Button>Ingresar</Button>
          </div>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm text-slate-300">
          <p>¿No tienes cuenta?</p>
          <Link to="/Register" className="text-emerald-400 hover:underline">Registrarse</Link>
        </div>
      </Card>
    </Container>
  );
}
export default LoginPage;
