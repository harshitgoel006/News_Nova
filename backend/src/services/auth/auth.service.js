import { User } from "../../models/user.model.js";
import { OTP } from "../../models/otp.model.js";
import { VerifiedEmail } from "../../models/verifiedEmail.model.js";
import { ApiError } from "../../utils/ApiError.js";
import sendEmail from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const authService = {

//////////////////////////////////////////////////////////
// EMAIL TEMPLATES
//////////////////////////////////////////////////////////

generateOtpEmailTemplate(otp) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
    <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px">

      <h2 style="color:#222;margin-bottom:10px">Verify your email</h2>

      <p style="color:#555">
        Hi there 👋,
      </p>

      <p style="color:#555">
        We received a request to verify your email address for your NewsApp account.
      </p>

      <p style="color:#555">
        Please use the OTP below to complete the verification process:
      </p>

      <div style="text-align:center;margin:30px 0">
        <span style="font-size:28px;font-weight:bold;letter-spacing:6px;color:#000">
          ${otp}
        </span>
      </div>

      <p style="color:#555">
        This OTP is valid for <strong>5 minutes</strong>.
      </p>

      <p style="color:#555">
        If you did not request this, you can safely ignore this email.
      </p>

      <hr style="margin:30px 0">

      <p style="font-size:12px;color:#999">
        This email was sent by <strong>NewsNova</strong>.  
        Please do not reply to this email.
      </p>

    </div>
  </div>
  `;
},

generateResetOtpTemplate(otp) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
    <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px">

      <h2 style="color:#222">Reset your password</h2>

      <p>Hi 👋,</p>

      <p>
        We received a request to reset your password for your NewsApp account.
      </p>

      <p>Use the OTP below to continue:</p>

      <div style="text-align:center;margin:30px 0">
        <span style="font-size:28px;font-weight:bold;letter-spacing:6px">
          ${otp}
        </span>
      </div>

      <p>This OTP will expire in <strong>5 minutes</strong>.</p>

      <p>
        If you did not request a password reset, please ignore this email.
      </p>

      <hr style="margin:30px 0">

      <p style="font-size:12px;color:#999">
        — NewsNova Security Team
      </p>

    </div>
  </div>
  `;
},

generatePasswordChangedTemplate(name) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
    <div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;border-radius:10px">

      <h2 style="color:#111;margin-bottom:10px">
        🔐 Your password was changed
      </h2>

      <p style="color:#555;font-size:15px">
        Hi ${name},
      </p>

      <p style="color:#555;font-size:15px">
        This is a confirmation that the password for your <strong>NewsApp</strong> account has been successfully changed.
      </p>

      <div style="background:#f8f8f8;padding:12px;border-radius:6px;margin:20px 0">
        <p style="margin:0;color:#333;font-size:14px">
          If you made this change, you can safely ignore this email.
        </p>
      </div>

      <div style="background:#fff3f3;padding:12px;border-radius:6px;margin:20px 0">
        <p style="margin:0;color:#b00020;font-size:14px">
          ⚠️ If you did NOT change your password, please reset it immediately to secure your account.
        </p>
      </div>

      <p style="color:#555;font-size:14px">
        For security reasons, all your active sessions have been logged out.
      </p>

      <hr style="margin:30px 0">

      <p style="font-size:12px;color:#999">
        This is an automated message from <strong>NewsNova</strong>.  
        Please do not reply to this email.
      </p>

    </div>
  </div>
  `;
},

generatePasswordResetSuccessTemplate(name) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
    <div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;border-radius:10px">

      <h2 style="color:#111;margin-bottom:10px">
        🔐 Your password has been reset
      </h2>

      <p style="color:#555;font-size:15px">
        Hi ${name},
      </p>

      <p style="color:#555;font-size:15px">
        Your password for your <strong>NewsApp</strong> account has been successfully reset.
      </p>

      <div style="background:#f8f8f8;padding:12px;border-radius:6px;margin:20px 0">
        <p style="margin:0;color:#333;font-size:14px">
          You can now log in using your new password.
        </p>
      </div>

      <div style="background:#fff3f3;padding:12px;border-radius:6px;margin:20px 0">
        <p style="margin:0;color:#b00020;font-size:14px">
          ⚠️ If you did NOT perform this action, your account may be compromised.  
          Please reset your password immediately.
        </p>
      </div>

      <p style="color:#555;font-size:14px">
        For your security, all previous sessions have been logged out.
      </p>

      <hr style="margin:30px 0">

      <p style="font-size:12px;color:#999">
        — NewsNova Security Team  
        This is an automated email, please do not reply.
      </p>

    </div>
  </div>
  `;
},
generateEmailChangedTemplate(name, newEmail) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
    <div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;border-radius:10px">

      <h2 style="color:#111;margin-bottom:10px">
        📧 Your email has been changed
      </h2>

      <p style="color:#555;font-size:15px">
        Hi ${name},
      </p>

      <p style="color:#555;font-size:15px">
        This is a confirmation that your <strong>NewsNova</strong> account email has been successfully updated.
      </p>

      <div style="background:#f8f8f8;padding:12px;border-radius:6px;margin:20px 0">
        <p style="margin:0;color:#333;font-size:14px">
          Your new email address is:
        </p>
        <p style="margin:5px 0 0;font-weight:bold;color:#000">
          ${newEmail}
        </p>
      </div>

      <div style="background:#fff3f3;padding:12px;border-radius:6px;margin:20px 0">
        <p style="margin:0;color:#b00020;font-size:14px">
          ⚠️ If you did NOT make this change, please secure your account immediately.
        </p>
      </div>

      <p style="color:#555;font-size:14px">
        For your safety, we recommend reviewing your account activity.
      </p>

      <hr style="margin:30px 0">

      <p style="font-size:12px;color:#999">
        — NewsNova Security Team  
        This is an automated email, please do not reply.
      </p>

    </div>
  </div>
  `;
},



//////////////////////////////////////////////////////////
// SEND OTP
//////////////////////////////////////////////////////////


async sendOtp(email) {
if (!email) throw new ApiError(400, "Email required");

email = email.toLowerCase().trim();

const existingUser = await User.findOne({ email });
if (existingUser) {
throw new ApiError(400, "User already exists. Please login.");
}

const otp = Math.floor(100000 + Math.random() * 900000).toString();

await OTP.findOneAndDelete({ email, purpose: "verify_email" });

await OTP.create({
email,
otpHash: otp,
purpose: "verify_email",
});

// ✅ FIXED (await added)
await sendEmail(
email,
"Verify your email",
this.generateOtpEmailTemplate(otp)
);

console.log("OTP:", otp);

return { message: "OTP sent successfully" };
},



//////////////////////////////////////////////////////////
// VERIFY OTP
//////////////////////////////////////////////////////////

async verifyOtp(email, otp) {

  const record = await OTP.findOne({
    email,
    purpose: "verify_email"
  }).select("+otpHash");

  if (!record) throw new ApiError(400, "OTP expired");

  if (record.expiresAt < Date.now()) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= 5) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many attempts");
  }

  const valid = await record.verifyOTP(otp);

  if (!valid) {
    record.attempts++;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  await VerifiedEmail.findOneAndUpdate(
    { email },
    {
      email,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true }
  );

  await OTP.deleteOne({ _id: record._id });
},



//////////////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////////////

async registerUser({ fullname, email, password }) {

  const verified = await VerifiedEmail.findOne({ email });

  if (!verified || verified.expiresAt < Date.now()) {
    throw new ApiError(403, "Please verify your email first");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
  });

  await VerifiedEmail.deleteOne({ email });

  return await User.findById(user._id)
    .select("-password -refreshTokens");
},



//////////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////////

async loginUser(email, password) {

  const user = await User.findOne({ email })
    .select("+password +refreshTokens");

  if (!user) throw new ApiError(401, "Invalid credentials");

  const valid = await user.isPasswordCorrect(password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } =
    await this.generateAccessAndRefreshToken(user._id);

  return { user, accessToken, refreshToken };
},



//////////////////////////////////////////////////////////
// TOKENS
//////////////////////////////////////////////////////////

async generateAccessAndRefreshToken(userId) {

  const user = await User.findById(userId).select("+refreshTokens");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const tokenHash = user.hashToken(refreshToken);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  user.refreshTokens.push({
    tokenHash,
    expiresAt: expiryDate
  });

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
},



//////////////////////////////////////////////////////////
// FORGOT PASSWORD
//////////////////////////////////////////////////////////

async sendResetOtp(email) {
const user = await User.findOne({ email });

if (!user) {
throw new ApiError(404, "User with this email does not exist");
}

const otp = Math.floor(100000 + Math.random() * 900000).toString();

await OTP.findOneAndDelete({ email, purpose: "reset_password" });

await OTP.create({
email,
otpHash: otp,
purpose: "reset_password"
});

// ✅ FIXED
await sendEmail(
email,
"Reset your password",
this.generateOtpEmailTemplate(otp)
);
},

async verifyResetOtp(email, otp) {

  const record = await OTP.findOne({
    email,
    purpose: "reset_password"
  }).select("+otpHash");

  if (!record) throw new ApiError(400, "OTP expired");

  const valid = await record.verifyOTP(otp);

  if (!valid) throw new ApiError(400, "Invalid OTP");
},

async resetPassword(email, otp, newPassword) {

  const record = await OTP.findOne({
    email,
    purpose: "reset_password"
  }).select("+otpHash");

  if (!record) throw new ApiError(400, "OTP expired");

  if (record.expiresAt < Date.now()) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= 5) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many attempts");
  }

  const valid = await record.verifyOTP(otp);

  if (!valid) {
    record.attempts++;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findOne({ email })
    .select("+password +refreshTokens");

  if (!user) throw new ApiError(404, "User not found");

  // 🔥 FIX 1: SAME PASSWORD CHECK
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  // 🔥 FIX 2: PASSWORD STRENGTH (OPTIONAL BUT GOOD)
  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  user.password = newPassword;

  // 🔥 logout from all devices
  user.refreshTokens = [];

  await user.save({ validateBeforeSave: false });

  await OTP.deleteOne({ _id: record._id });

  // ✅ SEND EMAIL
  await sendEmail(
    user.email,
    "Your password has been reset",
    this.generatePasswordChangedTemplate(user.fullname)
  );
},



//////////////////////////////////////////////////////////
// CHANGE PASSWORD
//////////////////////////////////////////////////////////

async changePassword(userId, oldPassword, newPassword) {

  const user = await User.findById(userId)
    .select("+password +refreshTokens");

  if (!user) throw new ApiError(404, "User not found");

  const valid = await user.isPasswordCorrect(oldPassword);
  if (!valid) throw new ApiError(401, "Wrong password");

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  user.password = newPassword;

  // 🔥 logout from all devices
  user.refreshTokens = [];

  await user.save({ validateBeforeSave: false });

  // ✅ SEND EMAIL
  await sendEmail(
user.email,
"Your password has been changed",
this.generatePasswordChangedTemplate(user.fullname)
);

},



//////////////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////////////

async logoutUser(userId, refreshToken) {
  const user = await User.findById(userId)
    .select("+refreshTokens");

  const tokenHash = user.hashToken(refreshToken);

  user.refreshTokens = user.refreshTokens.filter(
    t => t.tokenHash !== tokenHash
  );

  await user.save({ validateBeforeSave: false });
},



//////////////////////////////////////////////////////////
// REFRESH TOKEN
//////////////////////////////////////////////////////////

async refreshAccessToken(refreshToken) {

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id)
    .select("+refreshTokens");

  const tokenHash = user.hashToken(refreshToken);

  const exists = user.refreshTokens.find(
    t => t.tokenHash === tokenHash
  );

  if (!exists) throw new ApiError(401, "Invalid token");

  return await this.generateAccessAndRefreshToken(user._id);
},



async sendEmailChangeOtp(userId, newEmail) {

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  newEmail = newEmail.toLowerCase().trim();

  const exists = await User.findOne({ email: newEmail });
  if (exists) {
    throw new ApiError(400, "Email already in use");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.findOneAndDelete({
    email: newEmail,
    purpose: "change_email"
  });

  await OTP.create({
    email: newEmail,
    otpHash: otp,
    purpose: "change_email"
  });

  await sendEmail(
newEmail,
"Verify your new email",
this.generateOtpEmailTemplate(otp)
);

},

async verifyEmailChange(userId, newEmail, otp) {

  const record = await OTP.findOne({
    email: newEmail,
    purpose: "change_email"
  }).select("+otpHash");

  if (!record) throw new ApiError(400, "OTP expired");

  const valid = await record.verifyOTP(otp);
  if (!valid) throw new ApiError(400, "Invalid OTP");

  const user = await User.findById(userId);
  const oldEmail = user.email;

  user.email = newEmail;
  await user.save();

  await OTP.deleteOne({ _id: record._id });

  // 🔥 notify old email
  await sendEmail(
oldEmail,
"Your email was changed",
this.generateEmailChangedTemplate(user.fullname, newEmail)
);

}

};