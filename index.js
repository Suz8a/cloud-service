const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
admin.initializeApp();

/**
 * Here we're using Gmail to send
 */
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.googlemail.com", // Gmail Host
  port: 465, // Port
  secure: true, // this is true as port is 465
  auth: {
    user: "troquel.mail.sender@gmail.com",
    pass: "troquel_mail_sender"
  }
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // getting dest email by query string
    const dest = req.query.dest;
    const folio = req.query.folio;
    const cliente = req.query.cliente;
    const correo = req.query.correo;
    const descripcion = req.query.descripcion;

    const mailOptions = {
      from: "troquel.mail.sender@gmail.com", // Something like: Jane Doe <janedoe@gmail.com>
      to: dest,
      subject: "Reporte de Problemas", // email subject
      html: `<p style="font-size: 16px;">Folio de pedido ${folio}</p>
                <br/>
                <span> Cliente: ${cliente} </span>
                <br/>
                <span> Correo: ${correo} </span>
                <br/><br/>
                <span> Descripcion: </span>
                <p> ${descripcion}</p>
            ` // email content in HTML
    };

    // returning results
    return transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        return res.send(erro.toString());
      }
      return res.send("Sended");
    });
  });
});
