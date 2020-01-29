/* eslint-disable promise/no-nesting */
/* eslint-disable consistent-return */
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
  });

const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.onMessageReceived = functions.database.ref('/messages/{pushKey}').onWrite(event => {
  // Only send email for new messages.
    if (event.before === event.after) {
      return;
    }
    
    const val = event.after._data;

    
    const mailOptions = {
      to: 'cpek@capgemini.com',
      //to: 'valentin.pereira@capgemini.com',
      subject: `[Enterprise Readiness Tool] New Message from ${val.name} - ${val.organization}`,
      html: val.html
    };
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('Mail sent to', mailOptions.to)
    });
  });

  exports.onSubmitReceived = functions.database.ref('/submits/{pushKey}').onWrite(event => {
    // Only send email for new messages.
      if (event.before === event.after) {
        return;
      }
      
      const val = event.after._data;
  
      
      const clientMailOptions = {
        to: val.email,
        subject: `Capgemini Enterprise Readiness Assessment - Thank you for your submission!`,
        html: val.ClientHtml
      };

      const ownerMailOptions = {
        //to: 'valentin.pereira@capgemini.com',
        to: 'cpek@capgemini.com',
        subject: `[Enterprise Readiness Tool] New Submission from ${val.organization}`,
        html: val.OwnerHtml
      };
      return mailTransport.sendMail(clientMailOptions).then(() => {
        return mailTransport.sendMail(ownerMailOptions).then(() => {
          return console.log('Mails Submitted!');
        })
      });
    });