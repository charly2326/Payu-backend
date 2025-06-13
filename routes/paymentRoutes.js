const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// ✅ Firebase Admin
const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Asegúrate de tener GOOGLE_APPLICATION_CREDENTIALS
  });
}

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
        success: "https://test-322a2.web.app/confirmacion.html?status=success",
        failure: "https://test-322a2.web.app/confirmacion.html?status=failure",
        pending: "https://test-322a2.web.app/confirmacion.html?status=pending"
      },
      auto_return: "approved",
      notification_url: "https://tu-api.com/notificacion" // Opcional para webhooks
    };

    const response = await mercadopago.preferences.create(preference);
    console.log("Preferencia creada:", response.body);

    res.status(200).json({
      init_point: response.body.init_point,
      success_url: preference.back_urls.success,
      payment_id: response.body.id // ID de la transacción
    });

  } catch (error) {
    console.error("ERROR AL CREAR PAGO:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error interno al crear el pago" });
  }
});

// Ruta opcional para recibir webhooks de MercadoPago
router.post("/notificacion", (req, res) => {
  console.log("Notificación recibida:", req.body);
  // Aquí puedes procesar la notificación de pago
  res.status(200).send("OK");
});

module.exports = router;


