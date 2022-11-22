const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  created_at: {
    date: {
      type: Date,
    },
  },
  email: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  type: {
    type: String,
  },
  mobile: {
    type: String,
  },
  signup_status: {
    type: Boolean,
    default: false,
  },
  tg: {
    type: String,
  },
  fb: {
    type: String,
  },
  wa: {
    type: String,
  },
  user_org_name: {
    type: String,
  },
  whatsapp_verified: {
    type: Boolean,
    default: false,
  },
});

// export model user with UserSchema
module.exports = mongoose.model("User", UserSchema);
