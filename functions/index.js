const functions = require('firebase-functions');

/****  exposed functions ****/

/*
  aiAttributesWebhooks
  save typeform submitted data into aiAttributes collection
 */
exports.aiAttributesWebhook  = require('./http/aiAttributesWebhook');

/*
  aiAttributesGetApi
  return the collection of answers for a given id document
 */
exports.aiAttributesGetApi  = require('./http/aiAttributesGetApi');

exports.formAnswersCollected = functions.firestore
    .document('Forms/{requestID}')
    .onWrite((change, context) => {
      // If we set `/users/marie` to {name: "Marie"} then
      // context.params.userId == "marie"
      // ... and ...
      // change.after.data() == {name: "Marie"}
    });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
