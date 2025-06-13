const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// ✅ Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// Ruta de prueba para verificar que el backend responde
router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "🎉 Backend activo" });
});

// Ruta para crear un pago
router.post("/crear-pago", async (req, res) => {
  try {
    const { title, price, quantity } = req.body;

    const preference = {
      items: [
        {
          title,
          unit_price: Number(price),
          quantity: Number(quantity),
        },
      ],
      back_urls: {
        success: "https://tusitio.com/success",
        failure: "https://tusitio.com/failure",
        pending: "https://tusitio.com/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    res.status(200).json({
      init_point: response.body.init_point,
    });

  } catch (error) {
    console.error("❌ Error al crear preferencia:", error.message);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
});

module.exports = router;

