"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { register } from "@/services/auth";

type RegisterFormProps = React.ComponentPropsWithoutRef<"form"> & {
    /** Ruta interna a la que se quería volver (opcional, ej: "/checkout") */
    returnTo?: string;
};

export function RegisterForm({
    className,
    returnTo,
    ...props
}: RegisterFormProps) {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Aceptamos solo rutas internas tipo "/algo"
    const normalizeReturnTo = useCallback((raw?: string | null) => {
        if (!raw) return null;
        try {
            const decoded = decodeURIComponent(raw);
            return decoded.startsWith("/") ? decoded : null;
        } catch {
            return null;
        }
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Crea usuario (NO guardamos token acá)
            await register(form.name, form.email, form.password);

            // Si venía un returnTo, lo preservamos para el login
            const cleaned = normalizeReturnTo(returnTo ?? null);
            const next = cleaned
                ? `/login?returnTo=${encodeURIComponent(cleaned)}&registered=1`
                : `/`; // listado público

            router.push(next);
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Error al registrar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
            {/* opcional: lo incluimos por si lo necesitás en alguna server action */}
            {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Crear cuenta</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Completa tus datos para registrarte
                    </p>
                </div>

                <Field>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input
                        id="name"
                        placeholder="Tu nombre"
                        required
                        value={form.name}
                        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                        autoComplete="name"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                        autoComplete="email"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={form.password}
                        onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                        autoComplete="new-password"
                    />
                </Field>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Field>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Registrarme"}
                    </Button>
                </Field>

                <FieldSeparator>¿Ya tenés cuenta?</FieldSeparator>

                <FieldDescription className="text-center">
                    <a href="/login" className="underline underline-offset-4">
                        Inicia sesión aquí
                    </a>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
