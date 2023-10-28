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

const photographyPackageIdSchema = yup.object().shape({
  params: yup.object({
    id: yup
      .string()
      .test("Validate ObjectId", "${path} is not a valid ObjectId", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

const photographyPackageSchema = yup.object().shape({
  query: yup.object({
    package: yup.string(),
    timeForPackage: yup.string(),
    price: yup.number(),
    discount: yup.number(),
    active: yup.bool(),
  }),
});

const photographyPackageBodySchema = yup.object().shape({
  body: yup.object({
    package: yup.string().required(),
    timeForPackage: yup.string().required(),
    price: yup.number().required(),
    discount: yup.number().required(),
    active: yup.bool(),
  }),
});

const phoneNumberUpdateSchema = yup.object().shape({
  body: yup.object({
    package: yup.string(),
    timeForPackage: yup.string(),
    price: yup.number(),
    discount: yup.number(),
    active: yup.bool(),
  }),
});

module.exports = {
  validateSchema,
  photographyPackageSchema,
  photographyPackageIdSchema,
  photographyPackageBodySchema,
  phoneNumberUpdateSchema,
};
