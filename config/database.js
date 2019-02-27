const User = require("../models/User");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
module.exports = config => {
  mongoose.connect(config.dbPath, {
    useNewUrlParser: true
  });
  const db = mongoose.connection;
  db.once("open", async err => {
    if (err) {
      console.log(err);
    }

    await User.seedAdminUser()
      .then(() => {
        console.log("Database ready");
      })
      .catch(err => {
        console.log("Something went wrong");
        console.log(err);
      });
  });

  db.on("error", reason => {
    console.log(reason);
  });
};
