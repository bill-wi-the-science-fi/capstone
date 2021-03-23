const sgMail = require('@sendgrid/mail')
const axios = require('axios')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const data = JSON.stringify({
  personalizations: [
    {
      to: [{email: 'vpatel2@binghamton.edu', name: 'John Doe'}],
      subject: 'Hello, World!'
    }
  ],
  from: {email: 'vpatel621@gmail.com', name: 'John Doe'},
  reply_to: {email: 'vpatel621@gmail.com', name: 'John Doe'},
  content: [{value: 'Working Hello from the other side', type: 'text/plain'}]
})
const config = {
  method: 'post',
  url: 'https://api.sendgrid.com/v3/mail/send',
  headers: {
    Authorization:
      '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',
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
