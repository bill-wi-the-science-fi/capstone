const sgMail = require('@sendgrid/mail')
const SENDGRID_API_KEY = require('../../secrets')
sgMail.setApiKey(
  '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'
)
const msg = {
  to: ' vpatel621@gmail.com', // Change to your recipient
  from: 'vpatel621@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

// sgMail.setApiKey(
//   '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'
// )
// const msg = {
//   to: 'vpatel621@gmail.com.com',
//   from: 'vpatel621@gmail.com.com', // Use the email address or domain you verified above
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>'
// }(
//   //ES6
//   //ES8
//   async () => {
//     try {
//       await sgMail.send(msg)
//     } catch (error) {
//       console.error(error)

//       if (error.response) {
//         console.error(error.response.body)
//       }
//     }
//   }
// )()
