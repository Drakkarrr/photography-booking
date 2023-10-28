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
    return res.status(500).json({ type: err.name, message: err.message });
  }
};

const employeeIdSchema = yup.object().shape({
  params: yup.object({
    id: yup
      .string()
      .test("Validate ObjectId", "${path} is not a valid ObjectId", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

const employeeBodySchema = yup.object().shape({
  body: yup.object({
    firstName: yup.string().required().max(50),
    lastName: yup.string().required().max(50),
    position: yup.string().required(),
    email: yup.string().email().required().max(50),
    phoneNumber: yup
      .string()
      .matches(
        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
        "Phone number is not valid"
      ),
    address: yup.string().required().max(500),
    birthday: yup.date().nullable().min(new Date(1900, 0, 1)),
    age: yup.number(),
  }),
});

module.exports = { employeeIdSchema, employeeBodySchema, validateSchema };
