const User = require("../models/User");
const encryption = require("../util/encryption");
const Team = require("../models/Team");
const Project = require("../models/Project");

module.exports = {
  registerGet: (req, res) => {
    res.render("user/register");
  },
  registerPost: async (req, res) => {
    debugger;
    const userBody = req.body;
    if (
      !userBody.username ||
      !userBody.password ||
      !userBody.firstName ||
      !userBody.lastName
    ) {
      debugger;
      userBody.error = "Please fill all fields!";
      res.render("user/register", userBody);
      return;
    }

    const salt = encryption.generateSalt();
    const hashedPass = encryption.generateHashedPassword(
      salt,
      userBody.password
    );
    try {
      const user = await User.create({
        username: userBody.username,
        hashedPass,
        salt,
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        profilePicture: userBody.profilePicture || undefined,
        roles: ["User"]
      });
      req.logIn(user, err => {
        if (err) {
          userBody.error = err;
          res.render("user/register", userBody);
          return;
        } else {
          res.redirect("/");
        }
      });
    } catch (err) {
      debugger;
      userBody.error = err;
      res.render("user/register", userBody);
    }
  },
  logout: (req, res) => {
    req.logout();
    req.user = null;
    res.redirect("/");
  },
  loginGet: (req, res) => {
    res.render("user/login");
  },
  loginPost: async (req, res) => {
    const userBody = req.body;

    try {
      const user = await User.findOne({ username: userBody.username });
      if (!user) {
        userBody.error = "Username is invalid!";
        res.render("user/login", userBody);
        return;
      }

      if (!user.authenticate(userBody.password)) {
        userBody.error = "Invalid password!";
        res.render("user/login", userBody);
        return;
      }
      req.logIn(user, err => {
        if (err) {
          userBody.error = err;
          res.render("user/login", userBody);
          return;
        } else {
          res.redirect("/");
        }
      });
    } catch (err) {
      userBody.error = err;
      res.render("user/login", userBody);
    }
  },
  profileGet: (req, res) => {
    User.findById(req.user.id)
      .populate("teams")
      .then(user => {
        if (user) {
          let projects = [];
          user.teams.forEach(t => {
            t.projects.forEach(p => {
              projects.push(p);
            });
          });

          Project.find(
            {
              _id: { $in: projects }
            },
            (err, data) => {
              if (err) {
                console.log(err);
              } else {
                user.projects = data;
                res.render("user/profile", user);
              }
            }
          );
        } else {
          res.redirect("/");
        }
      })
      .catch(err => {
        console.log(err);
        res.redirect("/");
      });
  }
};
