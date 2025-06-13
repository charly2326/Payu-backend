const admin = require("firebase-admin");
const serviceAccount = require("./credenciales/test-322a2-firebase-adminsdk-fbsvc-87e7973693.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = db;

