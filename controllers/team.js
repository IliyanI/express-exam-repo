const Team = require("../models/Team");
const User = require("../models/User");

module.exports = {
  teamsGet: (req, res) => {
    let users = [];
    User.find({}).then(u => {
      let users = u;
      Team.find({})
        .populate("members")
        .populate("projects")
        .then(teams => {
          res.render("teams/teams", { users, teams });
        });
    });
  },
  teamsPost: (req, res) => {
    const user = req.body.user;
    const team = req.body.team;

    User.findOne({ _id: user }, (err, userData) => {
      if (userData.teams.indexOf(team) > -1) {
        res.redirect("/teams");
        return;
      } else {
        if (userData.teams) {
          userData.teams.push(team);
        } else {
          let teams = [];
          teams.push(team);
          userData.teams = teams;
        }
        userData.save(err => {
          console.log("saved");
          if (err) {
            console.log(err);
          }
        });
        Team.update({ _id: team }, { $push: { members: user } }, (err, raw) => {
          if (err) {
            res.render("/", { error: "There was an error" });
          }
          res.redirect("/teams");
        });
      }
    });
  },
  createGet: (req, res) => {
    res.render("teams/createTeam");
  },
  createPost: (req, res) => {
    const team = new Team({
      name: req.body.name
    });
    team.save((err, obj) => {
      if (err) {
        console.log(err);
        res.render("teams/createTeam", { error: "Team was not created!" });
      }
    });

    res.redirect("/");
  },
  leaveTeam: (req, res) => {
    User.update(
      { _id: req.user.id },
      { $pull: { teams: req.params.id } },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/user/profile");
        }
      }
    );
    Team.update(
      { _id: req.params.id },
      { $pull: { members: req.user.id } },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
};
