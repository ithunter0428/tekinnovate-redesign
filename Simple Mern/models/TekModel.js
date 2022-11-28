const mongoose = require("mongoose");

let tekSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    max: 13,
  },
  email_address: {
    type: String,
    required: true,
    max: 20,
  },
  email_subject: {
    type: String,
    required: true,
    max: 256,
  },
  email_description: {
    type: String,
    required: true,
  },
  dueDate: Date,
});

module.exports = Tek = mongoose.model("client_enquiry", tekSchema);
