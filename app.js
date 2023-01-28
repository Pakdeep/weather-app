const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");
const jsdom = require("jsdom");
const { urlToHttpOptions } = require("url");
const { stringify } = require("querystring");
const internal = require("stream");
const { JSDOM } = jsdom;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/weather", function (req, res) {
  res.render("weather");
});
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/contact",function(req,res){
  res.render("contact")
})
app.post("/weather", function (req, res) {
  let cname = _.capitalize(req.body.Name);
  let today = new Date();
  let options = {
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  let day = today.toLocaleDateString("en-us", options);
  let keyId = "0f3409f75be5e1ef679bcec06769610c";
  let units = "metric";
  const link =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cname +
    "&appid=" +
    keyId +
    "&units=" +
    units;
  https.get(link, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weather = JSON.parse(data);
      const temp = weather.main.temp;
      const feels = weather.main.feels_like;
      const desc = _.capitalize(weather.weather[0].description);
      const icon = weather.weather[0].icon;
      const humidity = weather.main.humidity;
      const wind = weather.wind.speed;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.render("weather", {
        city: cname,
        date: day,
        temp: temp,
        feel: feels,
        desc: desc,
        humidity: humidity,
        wind: wind,
        image:imageURL
      });

    });
  });
});

app.listen(process.env.PORT || 1998, function () {
  console.log("app listening to port 1998");
});
