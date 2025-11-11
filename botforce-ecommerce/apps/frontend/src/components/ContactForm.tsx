"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";

export function ContactForm() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: conectar a endpoint /api/contact o a tu CRM
        // Por ahora, sólo simulamos el envío:
        await new Promise((r) => setTimeout(r, 800));

        setLoading(false);
        if (typeof window !== "undefined") {
            // Si usás sonner, podés reemplazar por toast.success("...");
            alert("¡Gracias! Te contactaremos a la brevedad.");
        }
        (e.target as HTMLFormElement).reset();
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="name" placeholder="Nombre y apellido" required />
                <Input name="email" type="email" placeholder="Email" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="company" placeholder="Empresa (opcional)" />
                <select
                    name="interest"
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    defaultValue="comprar"
                >
                    <option value="comprar">Quiero comprar automatizaciones</option>
                    <option value="vender">Quiero vender mis automatizaciones</option>
                    <option value="sumarme">Quiero sumarme al proyecto</option>
                </select>
            </div>

            <Textarea
                name="message"
                placeholder="Contanos tu caso o lo que te interesa automatizar…"
                className="min-h-[120px]"
            />

            <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                    En 24–48h hábiles te respondemos con los próximos pasos.
                </p>
                <Button type="submit" disabled={loading}>
                    {loading ? "Enviando…" : "Enviar"}
                </Button>
            </div>
        </form>
    );
}
