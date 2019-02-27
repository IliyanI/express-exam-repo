const Project = require("../models/Project");
const Teams = require("../models/Team");

module.exports = {
  projectsGet: (req, res) => {
    let projects = [];

    Project.find({})
      .populate("team")
      .then(pr => {
        projects = pr.filter(p => !p.team);
        Teams.find({}).then(teams => {
          if (res.locals.isAdmin) {
            res.render("projects/projects", { projects, teams });
          } else {
            res.render("projects/projects", { pr, teams });
          }
        });
      });
  },
  projectsPost: (req, res) => {
    Project.findOne({ _id: req.body.project }, function(err, projectData) {
      if (projectData) {
        projectData.team = req.body.team;
        projectData.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
    Teams.update(
      { _id: req.body.team },
      { $push: { projects: req.body.project } },
      () => {
        console.log("team updated");
      }
    );
    res.redirect("/");
  },
  createGet: (req, res) => {
    res.render("projects/createProject");
  },
  createPost: (req, res) => {
    const project = new Project({
      name: req.body.name,
      description: req.body.description
    });

    project.save(err => {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/");
  }
};
