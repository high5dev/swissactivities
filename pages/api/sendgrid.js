import sendgrid from "@sendgrid/mail";
import { createContact } from '../../services/getResponse';
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);


async function sendEmail(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  createContact({
    name: req.body.fullname,
    email: req.body.email,
    locale: req.body.locale,
    ip,
  })

  try {
    await sendgrid.send({
      to: "support@swissactivities.com", // Your email where you'll receive emails
      replyTo: req.body.email,
      from: "support@swissactivities.com", // your website email address here
      subject: `${req.body.subject}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>ContactUs</title>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <body>
        <div class="container" style="margin-left: 20px;margin-right: 20px;">
          <p style="font-size: 16px; margin-bottom: 10px;" >You've got a new mail from <b>${req.body.fullname}</b>, their email is: ✉️${req.body.email} </p>
          <div style="font-size: 16px;">
            <p>Message:</p>
            <p>${req.body.message}</p>
            <br>
          </div>
        </div>
      </body>
      </html>`,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message || error.body });
  }

  return res.status(200).json({ error: "" });
}

export default sendEmail;