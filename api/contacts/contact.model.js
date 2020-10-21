const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: Number,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    default: "free",
  },
  password: {
    type: String,
    required: true,
    min: 1,
    max: 95,
  },
  token: {
    type: String,
    default: "",
  },
});

const contactModel = mongoose.model("Contact", contactSchema);

module.export = contactModel;
