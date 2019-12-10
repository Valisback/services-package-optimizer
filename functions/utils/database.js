const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

module.exports = db;