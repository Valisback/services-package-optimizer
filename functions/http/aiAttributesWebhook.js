const functions = require('firebase-functions');
const saveData = require('../utils/saveData');
const utilsFuncs = require('../utils/utils');

module.exports = functions.https.onRequest((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  // verify form id
  utilsFuncs.getJsonItem(() => req.body.form_response.hidden.uid)
    .then(jsonItem => saveData(jsonItem, req.body))
    .then(() => res.send('Reveived successfully'))
    .catch(e => {
      console.error('error', e);
      res.status(500).send({
        error: ' sorry there is an error '
      })
    });
});