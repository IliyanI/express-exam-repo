const mongoose = require("mongoose");
const encryption = require("../util/encryption");

const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  hashedPass: { type: mongoose.Schema.Types.String, required: true },
  firstName: { type: mongoose.Schema.Types.String },
  lastName: { type: mongoose.Schema.Types.String },
  salt: { type: mongoose.Schema.Types.String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  profilePicture: {
    type: mongoose.Schema.Types.String,
    default:
      "https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-1pw6dak_23081c6b.jpeg"
  },
  roles: [{ type: mongoose.Schema.Types.String }]
});

userSchema.method({
  authenticate: function(password) {
    return (
      encryption.generateHashedPassword(this.salt, password) === this.hashedPass
    );
  }
});

const User = mongoose.model("User", userSchema);

User.seedAdminUser = async () => {
  try {
    let users = await User.find();
    if (users.length > 0) {
      return;
    }
    const salt = encryption.generateSalt();
    const hashedPass = encryption.generateHashedPassword(salt, "admin");
    return User.create({
      username: "admin",
      salt,
      hashedPass,
      roles: ["Admin"]
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = User;
