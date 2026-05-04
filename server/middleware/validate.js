// Reusable Joi validation middleware
// Usage: router.post('/path', validate(schema), controller)
const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    // Replace req.body with the validated & sanitized value
    req.body = value;
    next();
  };
}

module.exports = validate;
