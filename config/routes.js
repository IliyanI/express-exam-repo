const restrictedPages = require("./auth");
const homeController = require("../controllers/home");
const userController = require("../controllers/user");
const projectController = require("../controllers/project");
const teamsController = require("../controllers/team");

module.exports = app => {
  app.get("/", homeController.index);

  //user
  app.get(
    "/user/register",
    restrictedPages.isAnonymous,
    userController.registerGet
  );
  app.post(
    "/user/register",
    restrictedPages.isAnonymous,
    userController.registerPost
  );

  app.get("/user/login", restrictedPages.isAnonymous, userController.loginGet);
  app.post(
    "/user/login",
    restrictedPages.isAnonymous,
    userController.loginPost
  );

  app.post("/user/logout", restrictedPages.isAuthed, userController.logout);
  app.get("/user/profile", restrictedPages.isAuthed, userController.profileGet);

  //teams
  app.get("/teams", restrictedPages.isAuthed, teamsController.teamsGet);
  app.post("/teams", restrictedPages.isAuthed, teamsController.teamsPost);
  app.get(
    "/teams/create",
    restrictedPages.hasRole("Admin"),
    teamsController.createGet
  );
  app.post(
    "/teams/create",
    restrictedPages.hasRole("Admin"),
    teamsController.createPost
  );
  app.post(
    "/teams/leave/:id",
    restrictedPages.isAuthed,
    teamsController.leaveTeam
  );

  //projects
  app.get("/projects", restrictedPages.isAuthed, projectController.projectsGet);
  app.post(
    "/projects",
    restrictedPages.hasRole("Admin"),
    projectController.projectsPost
  );
  app.get(
    "/projects/create",
    restrictedPages.hasRole("Admin"),
    projectController.createGet
  );
  app.post(
    "/projects/create",
    restrictedPages.hasRole("Admin"),
    projectController.createPost
  );

  //Put this bellow all routes so it catches bad requests
  app.all("*", (req, res) => {
    res.status(404);
    res.send("404 Not Found");
    res.end();
  });
};
