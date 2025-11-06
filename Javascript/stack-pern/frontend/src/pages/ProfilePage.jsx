import { useAuth } from "../context/AuthContext";
import { Card, Container, Label, Input } from "../components/ui";
import miavatar from "../assets/miavatar.jpg";

function ProfilePage() {
  const { user } = useAuth(); // Desestructuramos el contexto

  if (!user) {
    return (
      <Container className="flex justify-center items-center h-[80vh]">
        <p className="text-slate-400">Cargando perfil...</p>
      </Container>
    );
  }

  return (
    <Container className="py-10 flex justify-center">
      <Card className="w-full max-w-lg">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">
          Perfil del Usuario
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={miavatar}
            alt="avatar del usuario"
            className="h-28 w-28 rounded-full border-2 border-emerald-500 shadow-md object-cover"
          />
          <p className="text-sm text-slate-400 mt-2 italic">Imagen de perfil</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={user.name || ""}
              disabled
              className="bg-slate-800/60 border border-emerald-700/60 text-slate-200 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email || ""}
              disabled
              className="bg-slate-800/60 border border-emerald-700/60 text-slate-200 cursor-not-allowed"
            />
          </div>

          {user.fecha_registro && (
            <div>
              <Label htmlFor="fecha">Fecha de Registro</Label>
              <Input
                id="fecha"
                value={new Date(user.fecha_registro).toLocaleDateString()}
                disabled
                className="bg-slate-800/60 border border-emerald-700/60 text-slate-200 cursor-not-allowed"
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
}

export default ProfilePage;
