import { Link, useLocation } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "./navigation";
import { Container } from "../ui";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import miavatar from "../../assets/miavatar.jpg";

function Navbar() {
  const location = useLocation();
  const { isAuth, signout, user } = useAuth();

  return (
    <nav className="bg-slate-950 border-b border-slate-800/70">
      <Container className="flex justify-between items-center py-4">
        <Link to="/" className="group">
          <h1 className="text-2xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
            Stack PERN
          </h1>
        </Link>

        <ul className="flex gap-x-2 items-center justify-center">
          {isAuth ? (
            <>
              {PrivateRoutes.map(({ name, path, icon }) => (
                <li key={name}>
                  <Link
                    to={path}
                    className={twMerge(
                      "flex items-center gap-x-1 px-3 py-2 rounded-md text-slate-300 font-medium hover:text-white hover:bg-emerald-700/20 transition-colors",
                      location.pathname === path &&
                        "bg-emerald-600/25 text-white ring-1 ring-emerald-500/40"
                    )}
                  >
                    {icon}
                    <span className="hidden sm:block">{name}</span>
                  </Link>
                </li>
              ))}

              <li
                className="flex items-center gap-x-1 px-3 py-2 rounded-md text-slate-300 font-medium hover:text-white hover:bg-rose-700/20 transition-colors cursor-pointer"
                onClick={() => signout()}
                aria-label="Cerrar sesión"
                title="Salir"
              >
                <BiLogOut className="h-5 w-5" />
                <span className="hidden sm:block">Salir</span>
              </li>

              {/* Avatar del usuario */}
              <li className="flex gap-x-2 items-center ml-2 bg-slate-900/70 px-3 py-2 rounded-lg border border-slate-800">
                <img
                  src={miavatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                />
                <span className="font-medium text-slate-100 max-w-[160px] truncate">
                  {user?.name || "Usuario"}
                </span>
              </li>
            </>
          ) : (
            PublicRoutes.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  className={twMerge(
                    "flex items-center px-3 py-2 rounded-md text-slate-300 font-medium hover:text-white hover:bg-emerald-700/20 transition-colors",
                    location.pathname === path &&
                      "bg-emerald-600/25 text-white ring-1 ring-emerald-500/40"
                  )}
                >
                  {name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </nav>
  );
}

export default Navbar;
