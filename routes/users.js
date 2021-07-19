import express from "express";
const usersRouter = express.Router();

import cleanBody from "../middlewares/cleanbody.js";
import AuthController from "../users/user.controller.js";
import validateToken from "../middlewares/validateToken.js";

const Controller = new AuthController();

usersRouter.post("/signup", cleanBody, Controller.Signup);

usersRouter.post("/login", cleanBody, Controller.Login);

usersRouter.patch("/activate", cleanBody, Controller.Activate);

usersRouter.patch("/forgot", cleanBody, Controller.ForgotPassword);

usersRouter.patch("/reset", cleanBody, Controller.ResetPassword);

usersRouter.patch("/logout", validateToken, Controller.Logout);

export default usersRouter;
