const sgMail = require('@sendgrid/mail')
const axios = require('axios')
const SENDGRID_API_KEY_SECRET = require('../../secrets')
sgMail.setApiKey(SENDGRID_API_KEY_SECRET)

const sendEmail = (
  recipientEmail,
  firstName = 'Hello',
  nominatorName = 'Hello',
  recipientUrl = 'www.google.com'
) => {
  const data = JSON.stringify({
    personalizations: [
      {
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
      Authorization: `Bearer ${SENDGRID_API_KEY_SECRET}`,
      'Content-Type': 'application/json'
    },
    data: data
  }
  axios(config)
    .then(function (response) {
      // console.log(response)
      console.log(response.status)
    })
    .catch(function (error) {
      console.log('There was an error sending your email', error)
    })
}

module.exports = sendEmail
