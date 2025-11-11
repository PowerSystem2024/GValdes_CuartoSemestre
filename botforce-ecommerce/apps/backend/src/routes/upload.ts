import { FastifyInstance } from "fastify";
import cloudinary from "../lib/cloudinary";
import { requireAuth } from "../lib/authMiddleware";
import { requireAdmin } from "../lib/requireAdmin";
import { Readable } from "node:stream";

function uploadBufferToCloudinary(buffer: Buffer, folder = "botforce/products") {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (err, result: any) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
        Readable.from(buffer).pipe(upload);
    });
}

export async function uploadRoutes(app: FastifyInstance) {
    app.register(async (admin) => {
        admin.addHook("preHandler", requireAuth);
        admin.addHook("preHandler", requireAdmin);

        admin.post("/api/upload", async (req, reply) => {
            const file = await req.file();
            if (!file) return reply.code(400).send({ error: "No se recibió archivo" });

            // (Opcional) validar tipo mime básico
            if (!file.mimetype?.startsWith("image/")) {
                return reply.code(400).send({ error: "Solo se aceptan imágenes" });
            }

            try {
                const buffer = await file.toBuffer();
                const res = await uploadBufferToCloudinary(buffer);
                return reply.send({ url: res.secure_url });
            } catch (err) {
                app.log.error({ err }, "Cloudinary upload error");
                return reply.code(500).send({ error: "No se pudo subir la imagen" });
            }
        });
    });
}
