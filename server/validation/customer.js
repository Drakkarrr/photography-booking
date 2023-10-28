//VALIDATE dùng để kiểm tra thông tin trong các câu query và params có đúng quy tắc hay ko hay phía client gửi lên tào lao.

const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const customerIdSchema = yup.object().shape({
  params: yup.object({
    id: yup
      .string()
      .test("Validate ObjectId", "${path} is not a valid ObjectId", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

const customerBodySchema = yup.object().shape({
  body: yup.object({
    firstName: yup.string().required().max(50),
    lastName: yup.string().required().max(50),
    email: yup.string().email().required().max(50),
    phoneNumber: yup
      .string()
      .matches(
        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
        "Phone number is not valid"
      ),
    address: yup.string().required().max(500),
    birthday: yup.date().nullable().min(new Date(1900, 0, 1)),
    refreshToken: yup.string(),
    roles: yup.array(),
  }),
});
const customerBodyPatchSchema = yup.object().shape({
  body: yup.object({
    firstName: yup.string().max(50),
    lastName: yup.string().max(50),
    email: yup.string().email().max(50),
    phoneNumber: yup
      .string()
      .matches(
        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
        "Phone number is not valid"
      ),
    address: yup.string().max(500),
    birthday: yup.date().nullable().min(new Date(1900, 0, 1)),
    refreshToken: yup.string(),
    roles: yup.array(),
  }),
});
const getCustomersSchema = yup.object({
  query: yup.object({
    Locked: yup.boolean(),
    email: yup.string(),
    firstName: yup.string(),
    lastName: yup.string(),
    phoneNumber: yup
      .string()
      .matches(/^\d+$/, "phoneNumber is not valid Number"),
    birthdayFrom: yup.string(),
    birthdayTo: yup.string(),
    address: yup.string(),
    refreshToken: yup.string(),
    skip: yup
      .string()
      .matches(/^\d+$/, "skip is not valid Number")
      .min(0)
      .max(1000),
    limit: yup
      .string()
      .matches(/^\d+$/, "limit is not valid Number")
      .min(0)
      .max(1000),
  }),
});

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(3).max(31).required(),
  }),
  params: yup.object({}),
});
module.exports = {
  validateSchema,
  customerBodySchema,
  customerIdSchema,
  getCustomersSchema,
  customerBodyPatchSchema,
};
