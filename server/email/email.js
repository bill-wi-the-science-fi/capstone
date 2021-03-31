const sgMail = require('@sendgrid/mail')
const axios = require('axios')
const SENDGRID_API_KEY_SECRET = require('../../secrets')
sgMail.setApiKey(SENDGRID_API_KEY_SECRET)

const sendEmail = (
  recipientEmail,
  firstName = 'Alan',
  nominatorName = 'Alpay',
  recipientUrl = 'www.google.com'
) => {
  const data = JSON.stringify({
    personalizations: [
      {
        to: [{email: recipientEmail, name: firstName, recipientUrl}],
        subject: `You've been nominated by ${nominatorName} to win an award`
      }
    ],
    from: {email: 'vpatel621@gmail.com', name: 'Pay Eth Forward'},

    reply_to: {email: 'vpatel621@gmail.com', name: 'Pay Eth Forward'},
    content: [
      {
        value: `<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Welcome Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
      @media screen {
        @font-face {
          font-family: 'Merriweather';
          font-style: normal;
          font-weight: 400;
          src: local('Merriweather'), local('Merriweather'),
            url(http://fonts.gstatic.com/s/merriweather/v8/ZvcMqxEwPfh2qDWBPxn6nmB7wJ9CoPCp9n30ZBThZ1I.woff)
              format('woff');
        }

        @font-face {
          font-family: 'Merriweather Bold';
          font-style: normal;
          font-weight: 700;
          src: local('Merriweather Bold'), local('Merriweather-Bold'),
            url(http://fonts.gstatic.com/s/merriweather/v8/ZvcMqxEwPfh2qDWBPxn6nhAPw1J91axKNXP_-QX9CC8.woff)
              format('woff');
        }
      }

      /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
      }

      /**
         * Remove extra space added to tables and cells in Outlook.
         */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }

      /**
         * Better fluid images in Internet Explorer.
         */
      img {
        -ms-interpolation-mode: bicubic;
      }

      /**
         * Remove blue links for iOS devices.
         */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }

      /**
         * Fix centering issues in Android 4.4.
         */
      div[style*='margin: 16px 0;'] {
        margin: 0 !important;
      }

      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /**
         * Collapse table borders to avoid space between cells.
         */
      table {
        border-collapse: collapse !important;
      }

      a {
        color: black;
      }

      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
    </style>
  </head>
  <body style="background-color: #d2c7ba">
    <!-- start preheader -->
    <div
      class="preheader"
      style="
        display: none;
        max-width: 0;
        max-height: 0;
        overflow: hidden;
        font-size: 1px;
        line-height: 1px;
        color: #fff;
        opacity: 0;
      "
    >
      A preheader is the short summary text that follows the subject line when
      an email is viewed in the inbox.
    </div>
    <!-- end preheader -->

    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">


      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="#D2C7BA">
          <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <tr>
              <td bgcolor="#ffffff" align="left">
                <img
                  src="https://cdn.stocksnap.io/img-thumbs/960w/alone-background_TJSWWAXG9T.jpg"
                  alt="Welcome"
                  width="600"
                  style="display: block; width: 100%; max-width: 100%"
                />
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
        </td>
      </tr>
      <!-- end hero -->

      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="#D2C7BA">
          <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <!-- start copy -->
            <tr>
              <td
                bgcolor="#ffffff"
                align="left"
                style="padding: 24px; font-size: 16px; line-height: 24px"
              >
                <h1
                  style="
                    margin: 0 0 12px;
                    font-family: 'Merriweather Bold', serif;
                    font-size: 32px;
                    font-weight: 400;
                    line-height: 48px;
                  "
                >
                  Welcome, ${firstName}!
                </h1>
                <p style="font-family: 'Merriweather', serif; margin: 0">
                  Thank you for being an awesome person and it hasn't gotten unnoticed. ${nominatorName} has
                  noticed and recently appreciate your kindness and has a donation in your name. In order to receive
                  this gift, click on the link below and continue to be you, a rockstar!
                </p>
              </td>
            </tr>
            <!-- end copy -->

            <!-- start button -->
            <tr>
              <td align="left" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 12px">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td
                            align="center"
                            bgcolor="#CC7953"
                            style="border-radius: 6px"
                          >
                            <a
                              href=${recipientUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style="
                                display: inline-block;
                                padding: 16px 36px;
                                font-family: 'Merriweather', serif;
                                font-size: 16px;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                              "
                              >Let's get started!</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end button -->

            <!-- start copy -->
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Merriweather', serif;
                  font-size: 16px;
                  line-height: 24px;
                  border-bottom: 5px solid #69bcb1;
                "
              >
                <p style="margin: 0">
                  Cheers,<br />
                  Pay Eth Forward Team
                </p>
              </td>
            </tr>
            <!-- end copy -->
          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
        </td>
      </tr>
      <!-- end copy block -->

      <!-- start footer -->
      <tr>
        <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
          <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <!-- start permission -->
            <tr>
              <td
                align="center"
                bgcolor="#D2C7BA"
                style="
                  padding: 12px 24px;
                  font-family: 'Merriweather', serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #666;
                "
              >
                <p style="margin: 0">
                  You received this email because we received a request to give
                  a donation for your email. If you do not want this donation
                  you can safely delete this email.
                </p>
              </td>
            </tr>
            <!-- end permission -->


            <tr>
              <td
                align="center"
                bgcolor="#D2C7BA"
                style="
                  padding: 12px 24px;
                  font-family: 'Merriweather', serif;
                  font-size: 14px;
                  line-height: 20px;
                  color: #666;
                "
              >
                <p style="margin: 0">
                 5 Hanover Square 11th floor, New York, NY 10004
                </p>
              </td>
            </tr>

          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
        </td>
      </tr>
      <!-- end footer -->
    </table>
    <!-- end body -->
  </body>
</html>

`,
        type: 'text/html'
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
      console.log(response)
      console.log(response.status)
    })
    .catch(function (error) {
      console.log(error)
    })
}

module.exports = sendEmail
