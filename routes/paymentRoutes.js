const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');

// Configura Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

router.post('/crear-pago', async (req, res) => {
  try {
    const { title, price, quantity, raffleId, index, userId } = req.body;

    const preference = {
      items: [{
        title,
        unit_price: Number(price),
        quantity: Number(quantity),
      }],
      back_urls: {
        success: 'https://tusitio.com/success',
        failure: 'https://tusitio.com/failure',
        pending: 'https://tusitio.com/pending'
      },
      auto_return: "approved",
      metadata: {
        raffleId,
        index,
        userId
      }
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error("Error creando preferencia de pago:", error);
    res.status(500).json({ error: "No se pudo crear el enlace de pago" });
  }
});

module.exports = router;


