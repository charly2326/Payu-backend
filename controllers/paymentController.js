const axios = require('axios');
require('dotenv').config();

const crearPago = async (req, res) => {
  const { title, price, email } = req.body;

  try {
    const response = await axios.post('https://api.mercadopago.com/v1/payments', {
      transaction_amount: Number(price),
      description: title,
      payment_method_id: "visa", // o dejar en blanco para usar Checkout Bricks
      payer: { email }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};

module.exports = { crearPago };

