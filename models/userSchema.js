const mongoose = require("mongoose");

const userSignupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  blockStatus: { type: Boolean, default: false },
});

// collection

const signup = mongoose.model("Signupdetails", userSignupSchema);

module.exports = signup;
