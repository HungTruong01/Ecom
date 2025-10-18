const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  if (!firstname || !lastname || !email || !mobile || !password)
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  const user = await User.findOne({ email });
  if (user) throw new Error("User already exists");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "Register is successfully. Please go login"
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, ...userData } = response.toObject();
    const accessToken = generateAccessToken(response._id, role);
    const refreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password -refreshToken -role");
  return res.status(200).json({
    success: false,
    result: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

module.exports = { register, login, getCurrent, refreshAccessToken, logout };
