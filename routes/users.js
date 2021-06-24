const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../users/user.controller");
const { validateToken } = require("../middlewares/validateToken");

router.post("/signup", cleanBody, AuthController.Signup);

router.post("/login", cleanBody, AuthController.Login);

router.patch("/activate", cleanBody, AuthController.Activate);

router.patch("/forgot", cleanBody, AuthController.ForgotPassword);

router.patch("/reset", cleanBody, AuthController.ResetPassword);

router.get("/logout", validateToken, AuthController.Logout);

router.get("/referred", validateToken, AuthController.ReferredAccounts);

module.exports = router;
