const admin = require("firebase-admin");
const { getApps } = require("firebase-admin/app");
const serviceAccount = require("./credentials/firebase-admin.json");

if (getApps().length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

admin
  .auth()
  .getUserByEmail("admin@gmail.com")
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
  })
  .then(() => {
    console.log("✅ User is now an admin");
  })
  .catch(console.error);

module.exports = { admin };
