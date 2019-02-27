const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.String, required: true, unique: true },
  description: { type: mongoose.Schema.Types.String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
});

projectSchema.path("description").validate(function() {
  return this.description.length <= 50;
}, "Description must be less than 50 symbols!");

module.exports = mongoose.model("Project", projectSchema);
