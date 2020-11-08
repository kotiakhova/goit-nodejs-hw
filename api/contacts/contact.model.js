const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
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
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
contactSchema.plugin(mongoosePaginate);

async function findContactByIdAndUpdate(contactId, updateParams) {
  return this.findByIdAndUpdate(
    contactId,
    {
      $set: updateParams,
    },
    { new: true }
  );
}
const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
