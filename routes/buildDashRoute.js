const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated"); 

const chalk = require("chalk");

// const buildElement = require("buildElements");

// Routes declarations
module.exports = app => {


    // This is the route for the end user to access their page
    // Consider making this route "/" in future
    app.get("/dasher", isAuthenticated, (req, res) => {

      db.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(cdUser => {
  
        buildDash(cdUser, req, res);
  
      });
    });

}    


// Main function for building up the page
function buildDash(cdUser, req, res) {
 
  console.log(chalk.blue.bgWhite(JSON.stringify(cdUser)));  

  //layout = dbExamples.layoutObject;
  //console.log(chalk.white.bgBlue(dbExamples.layoutObject));

  layout = JSON.parse(cdUser.layoutObject);
  console.log(chalk.white.bgBlue(layout));

  var rslt = "buildDash";

  for (let i = 0; i<layout.length; i++ ) {

      layout[i].columns.forEach((layoutObj)=> {

        //rslt += ""; // bootstrap code for setting column width

        console.log(chalk.black.bgWhite(`layout object = ${JSON.stringify(layoutObj)}`));

        rslt += "<section>";
        
        switch (layoutObj.key) {

            case "cnn" : rslt += buildCnn(layout[i].width, layoutObj);
                  break;

            case "staticLink" : rslt += buildStaticLink(layout[i].width, layoutObj);
                  break;
  
            case "nytimes" :
                  break;

            case "weather":
                  break;

            case "rss":
                  break;
            
            case "giphy":
                  break;

            default:  
                  rslt += `<p>layoutObj.content = ${JSON.stringify(layoutObj)}</p>`;
                  break;

        }      
        
        rslt += "</section>";

      });

      rslt += "<br>";
    }
    res.send(rslt);
}


function buildStaticLink(layoutObj) {

  var rslt = `<a href="http://www.nytimes.com" class="style3"><width="60">NYTimes</width="60"></a>`;

  // key: “placeholder”,
  // url: "https://www.washingtonpost.com",
  // displayStr: "WashPost"
  // objClass: "staticLink"  /* add to the class of the HTML element */


  return (rslt);
}

// [{ “columns”: [{ “width”: 6, “contents”:{ “id”: “cnn” } }, { “width”: 6, “contents”:{ “id”: “nyt”, “textInfo”: “sports”}}]}, { “columns”: [{ “width”: 4, “contents”:{ “id”: “weather” }}, { “width”: 4, “contents”: { “id”: “spotify”, “textInfo”: “styx” } }, { “width”: 4, “contents”: { “id”: “giphy” } }]}]
