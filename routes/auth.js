const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((input, { req }) => {
      //   if (input === "test@test.com") {
      //     throw new Error("This is a forbidden email address!");
      //   }
      //   return true;
      return User.findOne({ email: input }).then((userDocument) => {
        if (userDocument) {
          return Promise.reject(
            "E-mail already exists, please pick another one"
          );
        }
      });
    }),
  body("password", "Please enter an alphanumeric with atleast 5 characters.")
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((input, { req }) => {
    if (input !== req.body.password) {
      throw new Error("Password and Confirm Password do not match!");
    }
    return true;
  }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
