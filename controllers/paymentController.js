const crypto = require("crypto");
const axios = require("axios");

exports.processPayment = async (req, res) => {
  try {
    const { description, value, referenceCode, email } = req.body;

    const signatureString = `${process.env.API_KEY}~${process.env.MERCHANT_ID}~${referenceCode}~${value}~COP`;
    const signature = crypto.createHash("md5").update(signatureString).digest("hex");

    const paymentRequest = {
      language: "es",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey: process.env.API_KEY,
        apiLogin: process.env.API_LOGIN
      },
      transaction: {
        order: {
          accountId: process.env.ACCOUNT_ID,
          referenceCode,
          description,
          language: "es",
          signature,
          notifyUrl: process.env.NOTIFY_URL,
          additionalValues: {
            TX_VALUE: {
              value: Number(value),
              currency: "COP"
            }
          },
          buyer: {
            emailAddress: email
          }
        },
        payer: {
          emailAddress: email
        },
        extraParameters: {
          RESPONSE_URL: "https://tusitio.com/respuesta",
          FINANCIAL_INSTITUTION_CODE: "1022"
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: "PSE",
        paymentCountry: "CO",
        deviceSessionId: "session123456",
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0"
      },
      test: true
    };

    const response = await axios.post(
      "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi",
      paymentRequest,
      { headers: { "Content-Type": "application/json" } }
    );

    const paymentUrl = response.data?.transactionResponse?.extraParameters?.BANK_URL || null;

    if (!paymentUrl) {
      return res.status(400).json({ msg: "No se pudo generar el pago", paymentUrl: null });
    }

    res.status(200).json({
      msg: "Petición enviada a PayU con éxito",
      paymentUrl
    });
  } catch (error) {
    console.error("❌ Error en el controlador:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Error al procesar el pago",
      details: error?.response?.data || error.message
    });
  }
};

