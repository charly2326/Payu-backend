const admin = require("firebase-admin");
const serviceAccount = require("/etc/secrets/firebase-key.json"); // Usa el nombre real del archivo en Render

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;

