const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const gmailEmail = functions.config().gmail.email;

sgMail.setApiKey(functions.config().sendgrid.key);

const REGION = 'asia-northeast1';

exports.sendContactForm = functions
  .region(REGION)
  .https.onCall(async (data, context) => {
    const {email, name, subject, message} = data;

    if (!message || !email) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'message information is not provided',
        data
      );
    }

    try {
      const msg = {
        to: gmailEmail,
        from: {
          email: email,
          name: name ? name : 'Anonymous User',
        },
        subject: subject ? subject : 'No Subject',
        text: message,
        html: message,
      };

      await sgMail.send(msg);
      return {status: 'success'};
    } catch (err) {
      console.log(err);
      throw new functions.https.HttpsError(
        'internal-error',
        'encountered an unexpected error while sending email',
        err
      );
    }
  });
