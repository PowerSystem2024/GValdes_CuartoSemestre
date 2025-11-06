// server.cjs  (CommonJS). Si usas ESM, cambia require por import.
const express = require("express");
const cors = require("cors");
const path = require("path");
const mercadopago = require("mercadopago");

const app = express();

// === CREDENCIALES ===
// Access Token (SERVER SIDE, secreto)
mercadopago.configure({
  access_token: "APP_USR-3351633370612575-110613-75a1a6891beec7dcf1e5348f49655d01-2971763252",
});

app.use(cors()); // permite cualquier origen (para dev)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// sirve la carpeta client como estático
app.use(express.static(path.join(__dirname, "../client")));

// sirve / (raíz) con index.html correcto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.post("/create_preference", async (req, res) => {
  try {
    const { description, price, quantity } = req.body;

    const preference = {
      items: [
        {
          title: description || "Compra e-commerce",
          unit_price: Number(price),
          quantity: Number(quantity),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "http://localhost:8080/feedback?status=success",
        failure: "http://localhost:8080/feedback?status=failure",
        pending: "http://localhost:8080/feedback?status=pending",
      },
      //auto_return: "approved",

	  
    };

	console.log("MP preference payload:", preference);

    const mpRes = await mercadopago.preferences.create(preference);
    return res.json({ id: mpRes.body.id });
  } catch (err) {
    console.error("MP error:", err?.message, err?.cause?.[0]?.description || "");
    return res.status(500).json({ error: "mp_error", message: err.message });
  }
});


app.get("/feedback", (req, res) => {
  res.json({
    payment_id: req.query.payment_id,
    status: req.query.status,
    merchant_order_id: req.query.merchant_order_id,
  });
});

app.listen(8080, () => {
  console.log("Server OK http://localhost:8080");
});
