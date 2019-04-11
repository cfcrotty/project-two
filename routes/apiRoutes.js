const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = app => {
  
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/profile");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        console.log("New user created")
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(422).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  
  app.post("/api/layout", isAuthenticated, (req, res) => {
    db.User.update({
      layoutObject: req.body.data
    }, {
      where: {
        id: req.user.id
      }
    }
    ).then((response) => {
      res.status(200).end();
    })
  });

  app.get("/api/layout", isAuthenticated, (req, res) => {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(results => {
      res.json(results.dataValues.layoutObject);
    })
  });


  app.post("/api/settings", isAuthenticated, (req, res) => {
    // console.log(req.body.data);
    let dataArr = req.body.data;
    console.log(dataArr);
    db.User.update({
      chosenContent: dataArr
    }, {
      where: {
        id: req.user.id
      }
    }
    ).then((response) => {
      console.log("in response cb func")
      res.redirect("/box-layout");
    })
  })

  app.get("/api/settings", isAuthenticated, (req, res) => {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(results => {
      res.json(results.dataValues.chosenContent);
    });
  });

};
