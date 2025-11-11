import { MercadoPagoConfig } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("Falta MP_ACCESS_TOKEN en .env");
}

// SDK v2: se instancia la config y se pasa a los recursos (Preference, Payment, etc)
export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
