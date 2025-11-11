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

    return (
        <header className={cn("w-full border-b bg-background", className)}>
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="font-bold text-lg">
                    BotForce
                </Link>

                {/* Nav center */}
                <nav>
                    <ul className="flex items-center gap-6 text-sm">
                        <li>
                            <Link href="/#productos" className="hover:underline underline-offset-4">
                                Productos
                            </Link>
                        </li>
                        <li>
                            <Link href="/#precios" className="hover:underline underline-offset-4">
                                Precios
                            </Link>
                        </li>
                        <li>
                            <Link href="/docs" className="hover:underline underline-offset-4">
                                Docs
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right side: auth + cart */}
                <div className="flex items-center gap-3">
                    <CartButton />

                    {loading ? (
                        <span className="text-sm text-muted-foreground">Cargando…</span>
                    ) : user ? (
                        <>
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
