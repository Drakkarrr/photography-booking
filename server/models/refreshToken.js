const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema(
  {
    refreshToken: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

const RefreshToken = model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
