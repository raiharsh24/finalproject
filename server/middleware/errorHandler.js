const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  // Default
  let statusCode = 500;
  let message = "Internal Server Error";

  // 🔥 Custom known errors
  if (err.message === "User not found") {
    statusCode = 404;
    message = err.message;
  } 
  else if (err.message === "Incorrect password") {
    statusCode = 401;
    message = err.message;
  } 
  else if (
    err.message === "Email and password required" ||
    err.message === "Email required" ||
    err.message === "Email, OTP and password are required"
  ) {
    statusCode = 400;
    message = err.message;
  } 
  else if (
    err.message === "Invalid OTP" ||
    err.message === "OTP expired" ||
    err.message === "No OTP found"
  ) {
    statusCode = 400;
    message = err.message;
  } 
  else if (err.message === "User already exists") {
    statusCode = 409;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;