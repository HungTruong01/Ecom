const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  if (!firstname || !lastname || !email || !mobile || !password)
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  const user = await User.create(req.body);
  return res.status(201).json({
    success: user ? true : false,
    message: "User created successfully",
  });
});

module.exports = { register };
