const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res
        .status(400)
        .json({ message: "Username already exists", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res
        .status(400)
        .json({ message: "Email already exists", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
      },
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
