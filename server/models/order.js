const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dateBookingValidate = (value) => {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }
  const [dateStart, dateFinish] = value;
  if (!(dateStart instanceof Date) || !(dateFinish instanceof Date)) {
    //kiểm tra xem ngày trong mảng có thuộc kiểu Date hay không
    return false;
  }
  if (isNaN(dateStart.getTime()) || isNaN(dateFinish.getTime())) {
    //kiểm tra dateStart và dateFinish có phù hợp giá trị ngày tháng và thời gian hay không, nếu một trong 2 được phát hiện là NaN thì sẽ trả về true=> lúc đó sẽ return false
    return false;
  }
  return true;
};

const orderSchema = new Schema(
  {
    district: { type: String, require: true },
    province: { type: String, require: true },
    address: { type: String, require: true },
    note: { type: String },
    phone: { type: String },
    bookingPlace: { type: String },
    dateBooking: {
      type: Array,
      require: true,
      // validate: dateBookingValidate,
    },
    customerId: { type: Schema.Types.ObjectId, require: true },
    createOrderDate: { type: Date, default: Date.now },
    packageId: { type: Schema.Types.ObjectId, require: true },
    status: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

const Order = model("Order", orderSchema);

module.exports = Order;
