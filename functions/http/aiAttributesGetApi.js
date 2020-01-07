const functions = require('firebase-functions');
const readData = require('../utils/readData');


module.exports = functions.https.onRequest((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

    readData(JSON.parse(req.body))
    .then(data => res.send({ data : data }))
    .catch(e => {
      console.error('error', e);
      res.status(500).send({
        error: ' sorry there is an error '
      })
    });

});