"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth";
import { User } from "@/types/auth";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("botforce_token");
        if (!token) { router.replace("/login"); return; }
        getMe(token)
            .then(setUser)
            .catch(() => router.replace("/login"))
            .finally(() => setLoading(false));
    }, [router]);

    function logout() {
        localStorage.removeItem("botforce_token");
        sessionStorage.removeItem("botforce_user");
        router.push("/login");
    }

    if (loading) return <div className="p-6">Cargando...</div>;
    if (!user) return null;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">Hola, {user.name}</h1>
            <p className="text-muted-foreground text-sm">Rol: {user.role}</p>
            <Button variant="outline" onClick={logout}>Salir</Button>
        </div>
    );
}
