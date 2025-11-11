"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth";
import { User } from "@/types/auth";
import ProductManager from "@/components/dashboard/product-manager";


export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("botforce_token");
        if (!token) { router.replace("/login"); return; }
        getMe(token)
            .then((u) => {
                if (u.role !== "ADMIN") { router.replace("/"); return; }
                setUser(u);
            })
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
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Panel de administración</h1>
                <Button variant="outline" onClick={logout}>Salir</Button>
            </div>
            <ProductManager />
        </div>
    );
}
