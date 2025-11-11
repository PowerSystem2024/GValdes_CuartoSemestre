"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { cn } from "@/lib/utils";
import CartButton from "@/components/cart/cart-button";

export function Navbar({ className }: { className?: string }) {
    const router = useRouter();
    const { user, loading } = useAuthStatus();

    const logout = () => {
        localStorage.removeItem("botforce_token");
        sessionStorage.removeItem("botforce_user");
        router.push("/login");
    };

    // Nombre mostrado: prioridad a name; si no, parte local del email
    const displayName =
        user?.name?.trim() ||
        (user?.email ? user.email.split("@")[0] : "");

    return (
        <header className={cn("w-full border-b bg-background", className)}>
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="font-bold text-lg">
                    BotForce
                </Link>

                {/* Right side: auth + (cart si hay sesión) */}
                <div className="flex items-center gap-3">
                    {/* Carrito solo autenticado */}
                    {!loading && user ? <CartButton /> : null}

                    {loading ? (
                        <span className="text-sm text-muted-foreground">Cargando…</span>
                    ) : user ? (
                        <>
                            {/* Saludo con nombre */}
                            <div className="hidden sm:flex items-center gap-2 rounded-full border px-3 py-1">
                                <span className="text-base">👋</span>
                                <span className="text-sm">
                                    Hola{displayName ? `, ${displayName}` : ""}!
                                </span>
                            </div>

                            {user.role === "ADMIN" && (
                                <Button variant="ghost" asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            )}

                            <Button variant="outline" onClick={logout}>
                                Salir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Iniciar sesión</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Registrarse</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
