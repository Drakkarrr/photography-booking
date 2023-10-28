const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    name: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

const Roles = model("Roles", roleSchema);
module.exports = Roles;
