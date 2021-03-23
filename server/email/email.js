const sgMail = require('@sendgrid/mail')
const axios = require('axios')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmail(
  recipientEmail,
  firstName,
  nominatorName,
  recipientUrl = 'www.google.com'
) {
  const data = JSON.stringify({
    personalizations: [
      {
        // to: [{email: 'vpatel2@binghamton.edu', name: 'John Doe'}],

        to: [{email: recipientEmail, name: firstName, recipientUrl}],
        subject: `You've been nominated by: ${nominatorName} to win an award`
      }
    ],
    from: {email: 'vpatel621@gmail.com', name: 'Unicorn Corp'},

    reply_to: {email: 'vpatel621@gmail.com', name: 'Unicorn Corp'},
    content: [
      {
        value: `Hi:${firstName},
                You have been nominated to receive an award. Please sign up using the link below to receive
                your award!
                ${recipientUrl}`,
        type: 'text/plain'
      }
    ]
  })
  const config = {
    method: 'post',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: data
  }
  axios(config)
    .then(function (response) {
      console.log(response.config)
    })
    .catch(function (error) {
      console.log(error)
    })
}

module.exports = sendEmail
