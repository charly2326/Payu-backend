const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta visual para la raíz
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>PayU Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f0f2f5;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2ecc71;
            margin-bottom: 10px;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ PayU Backend en línea</h1>
          <p>Servidor desplegado correctamente en Render 🚀</p>
        </div>
      </body>
    </html>
  `);
});

// Tus rutas de pago
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

