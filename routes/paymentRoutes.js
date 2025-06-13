const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { v4: uuidv4 } = require("uuid");

// Inicializa Firebase Admin si no está inicializado
const adminApp = initializeApp({
  credential: applicationDefault()
});
const db = getFirestore(adminApp);

// Ruta para crear el pago
router.post("/crear-pago", async (req, res) => {
  try {
    console.log("Solicitud recibida en /crear-pago");
    const { title, price, quantity, email } = req.body;

    if (!title || !price || !quantity || !email) {
      return res.status(400).json({ error: "Faltan datos necesarios (title, price, quantity, email)" });
    }

    // 1. Generar un ID único para esta transacción
    const userId = uuidv4();

    // 2. Guardar en Firestore
    await db.collection("transacciones").doc(userId).set({
      rifa: title,
      precio: price,
      cantidad: quantity,
      email: email,
      boleto: Math.floor(1000 + Math.random() * 9000), // Ej: boleto 4 dígitos
      creado: new Date()
    });

    // 3. Crear la preferencia con Mercado Pago
    const preference = {
      items: [{
        title,
        unit_price: Number(price),
        quantity: Number(quantity),
        currency_id: "COP"
      }],
      back_urls: {
        success: `https://test-322a2.web.app/confirmacion.html?status=success&userId=${userId}`,
        failure: `https://test-322a2.web.app/confirmacion.html?status=failure`,
        pending: `https://test-322a2.web.app/confirmacion.html?status=pending`
      },
      auto_return: "approved",
      notification_url: "https://tu-api.com/notificacion" // webhook opcional
    };

    const response = await mercadopago.preferences.create(preference);

    res.status(200).json({
      init_point: response.body.init_point,
      success_url: preference.back_urls.success,
      userId,
      payment_id: response.body.id
    });

  } catch (error) {
    console.error("Error al crear el pago:", error.message);
    res.status(500).json({ error: "Error interno al crear el pago" });
  }
});

module.exports = router;


