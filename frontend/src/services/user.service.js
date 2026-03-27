import api from "./api";

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updateProfile = (data) => {
  return api.patch("/users/profile", data);
};

export const updateInterests = (interests) => {
  return api.patch("/users/interests", { interests });
};


export const changePassword = (oldPassword, newPassword) =>
  api.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });

export const sendEmailChangeOtp = (newEmail) =>
  api.post("/auth/change-email-otp", { newEmail });

export const verifyEmailChange = (newEmail, otp) =>
  api.post("/auth/verify-email-change", {
    newEmail,
    otp,
  });