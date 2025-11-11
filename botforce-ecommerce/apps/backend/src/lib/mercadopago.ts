import { MercadoPagoConfig } from "mercadopago";

const token = process.env.MP_ACCESS_TOKEN;
if (!token) throw new Error("Falta MP_ACCESS_TOKEN en .env");

// SDK v2
export const mp = new MercadoPagoConfig({
  accessToken: token,
  // integratorId opcional: process.env.MP_INTEGRATOR_ID
});
