var express = require("express"),
    passport = require('passport'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    router = require("./router"),
    passportCtrl = require("./auth/passport.js"),
    cookieParser = require('cookie-parser'),
    path = require("path");

dotenv.load();    

var app = express();    
    
//db setup 
var db = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/whatstoday");

// pass port set up 

passportCtrl(app, passport);

//middlewares
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use("/public", express.static(process.cwd() + "/public"));
app.use("/controllers", express.static(process.cwd()  + "/client/controllers"));
app.use("/services", express.static(process.cwd() + "/client/services"));

// routes
router(app, passport);

//start server
app.listen(process.env.PORT || 8080, function(){
    console.log("Express server is listening on port : " + process.env.PORT || 8080)
});