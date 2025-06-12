const express = require("express");
const router = express.Router();

// Ruta de prueba para verificar que el backend responde
router.post("/", (req, res) => {
  // Aquí podrías procesar un pago, por ahora solo responde
  res.status(200).json({ success: true, message: "Pago recibido correctamente ✅" });
});

module.exports = router;

