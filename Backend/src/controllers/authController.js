const User = require("../models/Users");
const generateToken = require("../utils/jwt");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          message: "Name, email, and password are required",
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: { code: "EMAIL_EXISTS", message: "Email already registered" },
      });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          message: "Email and password are required",
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

module.exports = { register, login };
