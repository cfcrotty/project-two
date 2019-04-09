const path = require("path");
const isAuthenticated = require("../config/middleware/isAuthenticated");

const db = require("../models");
var axios = require("axios");
//require("dotenv").config();
var keys = require("../keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS);

/**
 * This function is for spotify
 * @param {string} song 
 */
function getSpotify(song, callback) {
    song = song.trim();
    if (!song) song = "Somewhere Over The Rainbow";
    spotify.search({ type: 'track', query: song }).then(function (response) {
        var size = Object.keys(response.tracks.items).length;
        if (size > 0 && Array.isArray(response.tracks.items)) {
            let res = "https://open.spotify.com/embed/track/" + response.tracks.items[0].id;
            callback(true, res);
        }
    }).catch(function (err) {
        console.log('Error occurred: ' + err);
        callback(false, err);
    });
}

//getSpotify("Somewhere Over The Rainbow by Judy Garland", console.log);

var numArticles = 0;
function getNYTimes(event, callback) {
    numArticles = 3;
    let queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + process.env.NYTIMES + "&q=" + event;
    console.log(queryURL);
    axios.get(queryURL).then(function (NYTData) {
        //console.log(NYTData.data.response.docs);
        callback(true, NYTData.data.response);
        /*
        for (var i = 0; i < numArticles; i++) {
            var article = NYTData.data.response.docs[i];
            var headline = article.headline;
            var byline = article.byline;
            byline.original 
            headline.main 
             article.snippet 
            article.pub_date = article.pub_date.substring(0, article.pub_date.indexOf('+'));
             article.pub_date.replace('T', ' ') 
             article.web_url    
        }
        */
    }, function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
        callback(false, error);
    });
}

//getNYTimes("flowers");

/** 
 function to get weather data
 @param lat: latitude 
 @param long: longitude
 @param callback: a function to call when all data is done
 */
function getWeather(lat, long, callback) {
    var results;
    var future = 0;
    var history = 0;
    var theDate = moment().unix();

    if (!lat) lat = 32.8531813;
    if (!long) long = -117.1826385;

    var queryURL = "https://api.darksky.net/forecast/" + process.env.DARK_SKY + "/" + lat + "," + long + "," + theDate + "?units=us&exclude=minutely";

    axios.get(queryURL).then(function (response) {
        //console.log(response.data)
        var idx = moment.unix(theDate).format("YYYY-MM-DD");
        var res = response.data.currently;
        results = {
            unixTime: moment(idx).format('X'),
            date: idx,
            tempMax: res.temperature,
            cloudCover: res.cloudCover,
            humidity: Math.round(res.humidity * 100),
            summary: res.summary,
            icon: res.icon,
            pressure: res.pressure,
            windSpeed: res.windSpeed,
            summaryHourly: response.data.hourly.summary,
        };
        callback(true, results);
    }, function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
        callback(false, error);
    });

}
//getWeather(console.log);

function getGiphy(callback) {
    var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=" + process.env.GIPHY //+ "&limit=1";
    //var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=" + process.env.GIPHY + "&limit=1";
    axios.get(queryURL).then(function (response) {
        //console.log(response.data);
        //response.data.data.images.fixed_height_small.url
        //console.log(response.data.data.images.original.url);
        if (response.data.data.images.original.url) {
            callback(true, response.data.data.images.original.url);
        }
    }).catch((error) => {
        callback(false, error);
    });
}
//getGiphy(console.log);

//getNews("bbc-news","",console.log);
function getNews(source,topic,callback) {
    newsapi.v2.everything({
        q: topic,
        sources: source,//'bbc-news,the-verge,cnn,wired, techcrunch, the-new-york-times, associated-press'
        language: 'en',
        sortBy: 'top',
        page: 1
    }).then(response => {
        //console.log(response);
        //console.log(response.articles[0]);//.title, .description, .url, .publishedAt=2019-04-07T00:10:15Z
        callback(true,response);
    }).catch((error) => {
        //console.log(error);
        callback(false,error);
    });
}

module.exports = (app) => {
    app.get("/api", isAuthenticated, (req, res) => {
        db.User.findOne({
            where: {
              id: req.user.id
            },
            include: [db.Example]
          }).then(dbUser => {
            //res.render("box-layout", { user: dbUser });
            res.render("api", { user: dbUser });
          });
        
    });
    app.get("/giphy", (req, res) => {
        getGiphy((isSuccess, giphyRes) => {
            if (isSuccess) {
                var allResult = { giphy: giphyRes };
                res.status(200).json(allResult);
            } else {
                res.status(404).json({ giphy: "" });
            }
        });
    });
    app.post("/weather", isAuthenticated, (req, res) => { //needs latitude and longitude from client
        let lat = req.body.lat;
        let long = req.body.long;
        getWeather(lat, long, (isSuccess, result) => {
            if (isSuccess) {
                var allResult = { weather: result };
                res.status(200).json(allResult);
            } else {
                res.status(404).json({ weather: {} });
            }
        });
    });
    app.post("/nytimes", isAuthenticated, (req, res) => {
        let topic = req.body.topic;
        getNYTimes(topic, (isSuccess, result1) => {
            var allResult = [];
            if (isSuccess) {
                allResult = { nytimes: result1 };
                res.status(200).json(allResult);
            } else {
                res.status(404).json({ nytimes: {} });
            }
        });
    });
}