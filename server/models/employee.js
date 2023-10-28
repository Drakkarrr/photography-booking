const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const employeeSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String, required: true },
    age: { type: Number },
    birthday: { type: Date },
    password: { type: String },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
      },
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
      },
    },
    address: { type: String, required: true },
    imageUrl: { type: String },
    refreshToken: { type: String },
  },
  {
    versionKey: false,
  }
);

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
