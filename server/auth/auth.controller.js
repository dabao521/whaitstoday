'use strict'

var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.load();
var verifyJwt = require("express-jwt")({secret : process.env.SESSION_SECRET});
var compose = require("composable-middleware");
var users = require("../../models/users.js");
var config = require("./config.js");

exports.signToken = function(userid){
    return jwt.sign({_id : userid}, process.env.SESSION_SECRET);
}

function isAuth(){
    return compose().
        use(function(req, res, next){
            console.log("verifying jwt! : ", req.headers);
            verifyJwt(req, res, next);
        }).
        use(function(req, res, next){
            //when verifyJwt passes, req.user will have token structure
            console.log("You pass jwt verify : ", req.user);
            users.findOne({"_id" : req.user._id}, function(err, user){
                if(err) {
                    return next(err);
                }
                if(!user) {
                    return res.json(null);
                }
                req.user = user;
                return next();
            });
        });
}


exports.hasRole = function(requiredRole) {
    return compose().
        use(isAuth()).
        use(function(req, res, next){
            if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(requiredRole)) {
                return next();
            }else {
                return next(new Error("Not Authorized yet"));
            }
        });
};

exports.isAuthenticated = isAuth;



