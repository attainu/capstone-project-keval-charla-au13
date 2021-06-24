var admin = require("firebase-admin");

var serviceAccount = require("../config/fbServiceAccountKey.js");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
