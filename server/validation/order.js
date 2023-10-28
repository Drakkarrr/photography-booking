const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

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

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const OrderIdSchema = yup.object().shape({
  params: yup.object({
    id: yup
      .string()
      .test("validate objectId", "${path} is not a valid objectId", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

const OrderBodySchema = yup.object().shape({
  body: yup.object({
    district: yup.string(),
    province: yup.string(),
    address: yup.string(),
    note: yup.string(),
    phone: yup.string(),
    status: yup.string(),
    bookingPlace: yup.string(),
    //chưa validate yup cho dateBooking vì chưa biết làm :)))
    customerId: yup
      .string()
      .test("validate objectId", "${path} is not valid", (value) => {
        return ObjectId.isValid(value);
      }),
    createOrderDate: yup.date().default(() => new Date()),
    packageId: yup
      .string()
      .test("validate objectId", "${path} is not valid", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

module.exports = { validateSchema, OrderIdSchema, OrderBodySchema };
