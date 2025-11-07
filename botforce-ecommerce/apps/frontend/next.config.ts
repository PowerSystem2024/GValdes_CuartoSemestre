import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // convierte "../../" en una ruta ABSOLUTA desde el cwd del frontend
    root: path.resolve(process.cwd(), "..", ".."),
  },
};

export default nextConfig;
