const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var service = process.env.service;
var email = process.env.email;
var password = process.env.password;

var transporter = nodemailer.createTransport({
  service: service,
  auth: {
    user: email,
    pass: password
  }
});

app.get("/", function(req, res) {
  res.render("home");
});

app.post("/api/send", (req, res) => {
  const mailOptions = {
    from: email, // sender address
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    html: req.body.body // plain text body
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send("Email Sent!");
      console.log(info);
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server Started..."));
