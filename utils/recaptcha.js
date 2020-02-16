const axios = require("axios");
const AppError = require("../utils/appError");

module.exports = async (data, next) => {
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${data.token}`;
  const response = await axios.post(verifyUrl);
  if (!response.success && response.success === undefined) {
    return next(new AppError("Captcha verification failed", 400));
  } else if (body.score < 0.7) {
    return next(new AppError("You might be a bot, sorry!", 400));
  }
  return response.success;
};
