import { Input, Button, Card, Label, Container } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, errors: setUserErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signup(data);
    if (user) navigate("/Profile");
  });

  return (
    <Container className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        {setUserErrors && setUserErrors.map((err, i) => (
          <p key={i} className="bg-rose-900/40 border border-rose-700 text-rose-200 px-3 py-2 mb-2 rounded-lg">
            {err}
          </p>
        ))}
        <h3 className="text-3xl font-bold text-center text-emerald-400 my-6">Registro</h3>

        <form onSubmit={onSubmit}>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Tu nombre" {...register("name", { required: true })} />
          {errors.name && <p className="text-amber-300 text-sm mb-2">Este campo es requerido</p>}

          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" {...register("email", { required: true })} />
          {errors.email && <p className="text-amber-300 text-sm mb-2">Este campo es requerido</p>}

          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password", { required: true })} />
          {errors.password && <p className="text-amber-300 text-sm mb-2">Este campo es requerido</p>}

          <div className="flex justify-center mt-6">
            <Button>Registrarse</Button>
          </div>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm text-slate-300">
          <p>¿Ya tienes cuenta?</p>
          <Link to="/Login" className="text-emerald-400 hover:underline">Ingresar</Link>
        </div>
      </Card>
    </Container>
  );
}
export default RegisterPage;
