require("dotenv").config(); // 👈 Carga variables desde .env

const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN // 👈 Segura desde .env
});

const app = express();
app.use(cors());
app.use(express.json());

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api", paymentRoutes);

// ✅ Ruta para UptimeRobot
app.get("/status", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});

