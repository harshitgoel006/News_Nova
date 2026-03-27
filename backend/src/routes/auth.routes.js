import { Router } from "express";

import {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  changePassword,
  sendEmailChangeOtp,
  verifyEmailChange
} from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  signupSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  sendResetOtpSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
  changePasswordSchema,
  changeEmailSchema
} from "../validators/auth.validator.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/authRateLimit.middleware.js";

const router = Router();


router.post(
  "/send-otp",
  authLimiter,
  validate(sendOtpSchema),
  sendOtp
);

router.post(
  "/verify-otp",
  authLimiter,
  validate(verifyOtpSchema),
  verifyOtp
);


router.post(
  "/signup",
  authLimiter,
  validate(signupSchema),
  registerUser
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  loginUser
);


router.post(
  "/send-reset-otp",
  authLimiter,
  validate(sendResetOtpSchema),
  sendResetOtp
);

router.post(
  "/verify-reset-otp",
  authLimiter,
  validate(verifyResetOtpSchema),
  verifyResetOtp
);

router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  resetPassword
);


router.post(
  "/change-password",
  verifyJWT,
  validate(changePasswordSchema),
  changePassword
);

router.post(
  "/change-email-otp",
  verifyJWT,
  validate(changeEmailSchema),
  sendEmailChangeOtp
);

router.post(
  "/verify-email-change",
  verifyJWT,
  verifyEmailChange
);

router.post(
  "/refresh-token", 
  refreshAccessToken
);


router.post(
  "/logout", 
  verifyJWT, 
  logoutUser
);


export default router;