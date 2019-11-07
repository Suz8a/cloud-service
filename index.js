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
  auth: {
    user: "troquel.mail.sender@gmail.com",
    pass: "troque_mail_sender"
  }
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // getting dest email by query string
    const dest = req.query.dest;
    const autor = req.query.autor;
    const folio = req.query.folio;
    const cliente = req.query.cliente;
    const descripcion = req.query.descripcion;

    const mailOptions = {
      from: autor, // Something like: Jane Doe <janedoe@gmail.com>
      to: dest,
      subject: "Reporte de Problemas", // email subject
      html: `<p style="font-size: 16px;">Folio de pedido ${folio}</p>
                <br/>
                <span> Cliente: ${cliente} </span>
                <br/>
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
