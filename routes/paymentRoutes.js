const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// Configurar Mercado Pago con Access Token
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Crear pago
router.post("/crear-pago", async (req, res) => {
  try {
    const { title, price, quantity } = req.body;

    const preference = {
      items: [{
        title: title || "Producto",
        unit_price: Number(price) || 1,
        quantity: Number(quantity) || 1,
        currency_id: "COP"
      }],
      back_urls: {
        success: "https://test-322a2.web.app/success",
        failure: "https://test-322a2.web.app/failure",
        pending: "https://test-322a2.web.app/pending"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ init_point: response.body.init_point });

  } catch (error) {
    console.error("Error al crear pago:", error);
    res.status(500).json({ error: "Error interno al crear el pago" });
  }
});

module.exports = router;


