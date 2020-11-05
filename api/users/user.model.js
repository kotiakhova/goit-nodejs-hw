const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.updateToken = updateToken;

async function findUserByIdAndUpdate(id, updateParams) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: updateParams,
    },
    { new: true }
  );
}
async function findUserByEmail(email) {
  return this.findOne({ email });
}
async function updateToken(id, newToken) {
  return this.findUserByIdAndUpdate(
    id,

    {
      token: newToken,
    }
  );
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
