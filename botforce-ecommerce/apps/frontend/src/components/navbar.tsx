"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { cn } from "@/lib/utils";
import CartButton from "@/components/cart/cart-button";
import { clearAuth } from "@/lib/auth-storage";   // ⬅️ nuevo
import { setCartOwner } from "@/lib/cart";        // ⬅️ nuevo

export function Navbar({ className }: { className?: string }) {
    const router = useRouter();
    const { user, loading } = useAuthStatus();

    const logout = () => {
        clearAuth();
        // ✅ No borramos el carrito del usuario: queda guardado bajo cart:v2:<userId>
        // Solo cambiamos el owner actual a "guest" para que la sesión invitada empiece vacía (o con su propio carrito).
        setCartOwner(null); // 👈 sin { clearCurrent: true }
        router.push("/login");
    };


    const displayName =
        user?.name?.trim() || (user?.email ? user.email.split("@")[0] : "");

    return (
        <header className={cn("w-full border-b bg-background", className)}>
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg">BotForce</Link>

                <div className="flex items-center gap-3">
                    {!loading && user ? <CartButton /> : null}

                    {loading ? (
                        <span className="text-sm text-muted-foreground">Cargando…</span>
                    ) : user ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2 rounded-full border px-3 py-1">
                                <span className="text-base">👋</span>
                                <span className="text-sm">Hola{displayName ? `, ${displayName}` : ""}!</span>
                            </div>

                            {user.role === "ADMIN" && (
                                <Button variant="ghost" asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            )}

                            <Button variant="outline" onClick={logout}>Salir</Button>
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
