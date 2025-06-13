const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// Ruta para crear el pago
router.post("/crear-pago", async (req, res) => {
  try {
    console.log("Solicitud recibida en /crear-pago");
    console.log("Body recibido:", req.body);

    const { title, price, quantity } = req.body;

    if (!title || !price || !quantity) {
      console.error("Faltan campos en el body");
      return res.status(400).json({ error: "Faltan datos para procesar el pago" });
    }

    const preference = {
      items: [{
        title: title,
        unit_price: Number(price),
        quantity: Number(quantity),
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
    console.log("Preferencia creada:", response.body);

    res.status(200).json({ init_point: response.body.init_point });

  } catch (error) {
    console.error("ERROR AL CREAR PAGO:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error interno al crear el pago" });
  }
});

module.exports = router;

