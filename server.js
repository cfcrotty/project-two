require("dotenv").config();
const express = require("express");
const handlebars = require('handlebars');
const session = require("express-session");
const exphbs = require("express-handlebars");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");

// Requiring passport as we've configured it
const passport = require("./config/passport");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Morgan will any HTTP request to the terminal
app.use(morgan("dev"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({
    secret: process.env.SERVER_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Handlebars

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
handlebars.registerHelper('ifEquals',
  function (arg1,arg2,options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  }
);
handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});
var myGlobal = {
   title: "myapp"
};
handlebars.registerHelper('global', function(key){
  return myGlobal[key];
});
handlebars.registerHelper('addGlobal', function(key,val){
  myGlobal[key]=val;
  return;
});

// Routes
require("./routes/apiRoutes1")(app);
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

const syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(
      `App is running on PORT: ${PORT}. Go to http://localhost:${PORT}`
    );
  });
});

module.exports = app;
