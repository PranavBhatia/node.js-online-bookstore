const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Bcrypt comparison failed.");
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then((userDocument) => {
      if (userDocument) {
        req.flash("error", "E-mail already exists, please pick another one");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "coolpranav11@gmail.com", //pb@node-bookstore.com
            subject: "Welcome to the best bookstore!",
            html:
              "<h1>You are now a memeber of the best bookstore in the world! Cheers.</h1>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account found with this email.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        transporter.sendMail({
          to: req.body.email,
          from: "coolpranav11@gmail.com", //pb@node-bookstore.com
          subject: "Bookstore password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> here to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
