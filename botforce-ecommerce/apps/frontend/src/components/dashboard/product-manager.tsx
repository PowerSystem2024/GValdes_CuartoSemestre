// apps/frontend/src/components/dashboard/product-manager.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    priceCents: number;
    imageUrl?: string | null;
    currency?: string;
    status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
};

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<Partial<Product>>({});

    const token =
        typeof window !== "undefined" ? localStorage.getItem("botforce_token") : null;

    const load = async () => {
        const { data } = await api.get("/api/products?page=1&pageSize=50");
        setProducts(data.items);
    };

    useEffect(() => {
        load();
    }, []);

    const handleUpload = async (): Promise<string | null> => {
        if (!image) return null;
        setUploading(true);

        const form = new FormData();
        form.append("file", image);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ??
            process.env.NEXT_PUBLIC_API_BASE ??
            "http://localhost:3333"
            }/api/upload`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            }
        );

        setUploading(false);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error || "Upload failed");
        }

        const data = await res.json();
        return data.url as string;
    };

    const handleCreate = async () => {
        try {
            const imageUrl = await handleUpload();
            const slug = name.toLowerCase().replace(/\s+/g, "-");
            const body = {
                name,
                slug,
                description,
                priceCents: Math.round(parseFloat(price) * 100),
                imageUrl,
            };

            await api.post("/api/admin/products", body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Producto creado");
            setName("");
            setPrice("");
            setDescription("");
            setImage(null);
            load();
        } catch (err: any) {
            toast.error("Error al crear producto");
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Eliminado");
            load();
        } catch (e) {
            toast.error("No se pudo eliminar");
            console.error(e);
        }
    };

    // === Edición ===
    const startEdit = (p: Product) => {
        setEditingId(p.id);
        setEditDraft({
            name: p.name,
            description: p.description,
            priceCents: p.priceCents,
            imageUrl: p.imageUrl ?? undefined,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDraft({});
        setImage(null);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            let imageUrl = editDraft.imageUrl;
            if (image) {
                imageUrl = await handleUpload();
            }

            const body: any = {
                ...("name" in editDraft ? { name: editDraft.name } : {}),
                ...("description" in editDraft ? { description: editDraft.description } : {}),
                ...("priceCents" in editDraft ? { priceCents: Number(editDraft.priceCents) } : {}),
                ...(imageUrl ? { imageUrl } : {}),
            };

            await api.put(`/api/admin/products/${editingId}`, body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Producto actualizado");
            cancelEdit();
            load();
        } catch (e) {
            toast.error("No se pudo actualizar");
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Productos</h2>

            {/* Crear nuevo */}
            <div className="grid md:grid-cols-4 gap-2">
                <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <Input
                    placeholder="Precio ARS"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input type="file" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
            </div>

            <Button onClick={handleCreate} disabled={uploading || !name || !price}>
                {uploading ? "Subiendo..." : "Crear producto"}
            </Button>

            {/* Listado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {products.map((p) => {
                    const isEditing = editingId === p.id;
                    return (
                        <div key={p.id} className="border rounded-lg p-4 space-y-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {p.imageUrl && !isEditing && (
                                <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover rounded-md" />
                            )}

                            {!isEditing ? (
                                <>
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                        {p.description}
                                    </div>
                                    <div className="font-semibold">
                                        ${(p.priceCents / 100).toFixed(2)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => startEdit(p)}>
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Input
                                        placeholder="Nombre"
                                        value={editDraft.name ?? ""}
                                        onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                                    />
                                    <Input
                                        placeholder="Descripción"
                                        value={editDraft.description ?? ""}
                                        onChange={(e) =>
                                            setEditDraft((d) => ({ ...d, description: e.target.value }))
                                        }
                                    />
                                    <Input
                                        placeholder="Precio ARS"
                                        value={
                                            editDraft.priceCents != null
                                                ? String((editDraft.priceCents as number) / 100)
                                                : String(p.priceCents / 100)
                                        }
                                        onChange={(e) =>
                                            setEditDraft((d) => ({
                                                ...d,
                                                priceCents: Math.round(parseFloat(e.target.value || "0") * 100),
                                            }))
                                        }
                                    />
                                    <Input
                                        type="file"
                                        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={saveEdit} disabled={uploading}>
                                            {uploading ? "Subiendo..." : "Guardar"}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
