const express = require('express');
var cors = require('cors');
const app = express();
//const conn  = require('./database');
const nodemailer = require('nodemailer');
// Settings
app.set('port', process.env.PORT || 3001);

// Middlewares --> Antes de procesar algo (antes de la ruta)
app.use(express.json());

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
// Configurar cabeceras y cors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Content-Type", "application/json");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "*");
	next();
	});

//Options
app.options('/send-email', cors());

// Routes
app.get('/', (req, res) => res.send('EscuchaActiva - email service'))


app.post('/send-email', (req, res) => {
    console.log("send-email");
    let consulta = req.body.consulta;
    let email = req.body.email;
    let estudiante = req.body.estudiante;
    let emailEstudiante = req.body.emailEstudiante;
    console.log("body = " + consulta + " " + email + " " + estudiante + " " + emailEstudiante)

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com.',
        post: '465', //465 para SSL y 587 para TLS.
        secure: true,
        auth: {
            user: 'escuchaactivaseminario@gmail.com',
            pass: 'xyapktjujiehdmkq'
        }
    })
    let mailOptions = {
        from: 'Remitente',
        to: email,
        subject: 'Consulta de un estudiante',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
            <style>
              .landing {
                background: #022430;
                padding: 25px
              }
              .title {
                font-size: 1.3rem;
                color: rgba(30,196,151,1);
                margin-left: 20px;
                margin-top: 15px
              }
              .subtitle {
                font-size: 0.8rem;
                color: #eaeeef;
                margin-left: 20px;
                margin-button: 10px
              }
              .consulta {
                font-size: 1.0rem;
                color: #eaeeef;
                margin-left: 20px;
                margin-button: 20px
              }
            </style>
          </head>
          <body>
          <!-- Start Landing Page-->
          <div class="landing pt-2">
            <div class="container-fluid pt-1 pb-5">
              <div class="row justify-content-center p-5">
                <div class="col-12 text-center">
                  <p class="title text-light font-weight-bold">Nueva consulta del estudiante ${estudiante} </p>
                  <p class="subtitle text-light font-weight-bold">Email: ${emailEstudiante} </p>
                  <p class="consulta text-light pb-3">Consulta: ${consulta} </p>
                </div>
              </div>
            </div>
          </div>
          <!-- End Landing Page -->
          </body>
          </html>
        `
    }
    console.log("pre-sending");
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
	    console.log("error");
            res.status(500).send(error.message);
        }
	console.log("sending...");

        res.send(JSON.stringify({ "status": 200, "error": null, "response": "Consulta enviada correctamente." }));

    });
})
