import express from "express";
const router = express.Router();

import cleanBody from "../middlewares/cleanbody.js";
import * as AuthController from "../users/user.controller.js";
import validateToken from "../middlewares/validateToken.js";

router.post("/signup", cleanBody, AuthController.Signup);

router.post("/login", cleanBody, AuthController.Login);

router.patch("/activate", cleanBody, AuthController.Activate);

router.patch("/forgot", cleanBody, AuthController.ForgotPassword);

router.patch("/reset", cleanBody, AuthController.ResetPassword);

router.get("/logout", validateToken, AuthController.Logout);

router.get("/referred", validateToken, AuthController.ReferredAccounts);

export default router;
