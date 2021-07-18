import express from "express";
const usersRouter = express.Router();

import cleanBody from "../middlewares/cleanbody.js";
import * as AuthController from "../users/user.controller.js";
import validateToken from "../middlewares/validateToken.js";

usersRouter.post("/signup", cleanBody, AuthController.Signup);

usersRouter.post("/login", cleanBody, AuthController.Login);

usersRouter.patch("/activate", cleanBody, AuthController.Activate);

usersRouter.patch("/forgot", cleanBody, AuthController.ForgotPassword);

usersRouter.patch("/reset", cleanBody, AuthController.ResetPassword);

usersRouter.patch("/logout", validateToken, AuthController.Logout);

export default usersRouter;
