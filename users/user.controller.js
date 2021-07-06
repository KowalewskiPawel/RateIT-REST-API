import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuid } from "uuid";

import { customAlphabet as generate } from "nanoid";

import generateJwt from "./helpers/generateJwt.js";
import sendEmail from "./helpers/mailer.js";

import User from "./user.model.js";

import hashPassword from "./helpers/hashPassword.js";

import comparePasswords from "./helpers/comparePasswords.js";

const userSchema = Joi.object().keys({
  username: Joi.string().required().min(4),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const Signup = async (req, res) => {
  try {
    const result = userSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    let user = await User.findOne({
      email: result.value.email,
    });

    if (user) {
      return res.json({
        error: true,
        status: 400,
        message: "Email is already in use",
      });
    }

    const hash = await hashPassword(result.value.password);

    const id = uuid();
    result.value.userId = id;

    delete result.value.confirmPassword;
    result.value.password = hash;

    let code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now

    const sendCode = await sendEmail(result.value.email, code);

    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);
    const newUser = new User(result.value);
    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registration Success",
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }

    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "You must verify your email to active your account",
      });
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const { error, token } = await generateJwt(user.email, user.userId);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }

    user.accessToken = token;

    await user.save();

    return res.send({
      success: true,
      message: "User logged in successfully",
      accessToken: token,
    });
  } catch (err) {
    console.error(`Login error ${err}`);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

const Activate = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await User.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() }, // check if the code is expired
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {
      if (user.active)
        return res.send({
          error: true,
          message: "Account already activated",
          status: 400,
        });

      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Account activated.",
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({
        status: 400,
        error: true,
        message: "Cannot be processed",
      });
    }
    const user = await User.findOne({
      email: email,
    });

    let code = Math.floor(100000 + Math.random() * 900000);
    let response = await sendEmail(user.email, code);

    if (response.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send mail. Please try again later.",
      });
    }

    let expiry = Date.now() + 60 * 1000 * 15;
    user.resetPasswordToken = code;
    user.resetPasswordExpires = expiry; // 15 minutes

    await user.save();

    return res.send({
      success: true,
      message: "Please check your email inbox for the reset code",
    });
  } catch (error) {
    console.error("forgot-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message:
          "Couldn't process request. Please provide all mandatory fields",
      });
    }
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.send({
        error: true,
        message: "Password reset token is invalid or has expired.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords don't match",
      });
    }
    const hash = await hashPassword(req.body.newPassword);
    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = "";

    await user.save();

    return res.send({
      success: true,
      message: "Password has been changed",
    });
  } catch (error) {
    console.error("reset-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const Logout = async (req, res) => {
  try {
    const { id } = req.decoded;

    let user = await User.findOne({ userId: id });

    user.accessToken = "";

    await user.save();

    return res.send({ success: true, message: "User Logged out" });
  } catch (error) {
    console.error("user-logout-error", error);
    return res.stat(500).json({
      error: true,
      message: error.message,
    });
  }
};

const ReferredAccounts = async (req, res) => {
  try {
    const { referralCode } = req.decoded; //Destruction syntax

    const referredAccounts = await User.find(
      { referrer: referralCode },
      { email: 1, referralCode: 1, _id: 0 }
    );
    return res.send({
      success: true,
      accounts: referredAccounts,
      total: referredAccounts.length,
    });
  } catch (error) {
    console.error("fetch-referred-error", error);
    return res.stat(500).json({
      error: true,
      message: error.message,
    });
  }
};

export {
  Login,
  Signup,
  Activate,
  ForgotPassword,
  ResetPassword,
  Logout,
  ReferredAccounts,
};
