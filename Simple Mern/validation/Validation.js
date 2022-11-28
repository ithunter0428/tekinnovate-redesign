const isEmpty = require("../utils/is-empty");

module.exports = validateTekPlayload = (payload) => {
  const errors = {};
  if (isEmpty(payload.name)) errors.name = "Name is required!";
  else if (payload.name.length < 4)
    errors.name = "Name must be at least 4 characters!";

  let phoneNum = payload.phone;
  phoneNum = phoneNum.replaceAll(/[+ ]/g, '');
  if (phoneNum.search(/[^0-9]/) != -1)
    errors.phone = "Must be number!";
  if (isEmpty(payload.phone)) errors.phone = "Phone is required!";
  else if (payload.phone.length < 14 || payload.phone.length > 17)
    errors.phone = "Phone leng must be between 10 & 13!";

  if (isEmpty(payload.email)) errors.email = "Email is required!";

  if (isEmpty(payload.subject)) errors.subject = "Subject is required!";
  else if (payload.subject.length > 256)
    errors.subject = "Maximum length must be 256 characters";

  if (isEmpty(payload.message)) errors.message = "Message is required!";

  return { errors, isValid: isEmpty(errors) };
};
