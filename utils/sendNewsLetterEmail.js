const sendEmail = require('./sendEmail')

const sendNewsLetterEmail = async ({ email }) => {
  const message = `<p>Thank you for join our tech community and staying ahead with the latest in
            innovation, exclusive deals, and tech insights.</p>`
  return sendEmail({
    to: email,
    subject: 'News Letter Joined',
    html: `<h4>JocesTech Newsletter  </h4>
    ${message}
    `,
  })
}

module.exports = sendNewsLetterEmail
