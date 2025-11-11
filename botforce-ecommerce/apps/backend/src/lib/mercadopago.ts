import { MercadoPagoConfig } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("Falta MP_ACCESS_TOKEN en .env");
}

// v2: se crea una instancia de config y se pasa a los recursos
export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
