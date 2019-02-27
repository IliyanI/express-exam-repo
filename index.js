const env = process.env.NODE_ENV || "development";

const config = require("./config/config")[env];
require("./config/database")(config);
const app = require("express")();
require("./config/passport")();
require("./config/express")(app);
require("./config/routes")(app);
app.listen(config.port, console.log("App listening on port: " + config.port));
