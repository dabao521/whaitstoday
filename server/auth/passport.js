'use sctrict';

var localStrategy = require("passport-local").Strategy;
var users = require("../../models/users.js");

module.exports = function(app, passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done){
        users.findById(id, function(err, user){
            console.log(err);
            return done(null, user);
        });
    });
    
    
    passport.use(new localStrategy(function(email, password, done){
        console.log("email, password : ", email, password);
        users.findOne({"email" : email}, function(err, user){
            console.log("passport user : ", user);
            if(err) {
                return done(null, false);
            }
            if(!user) {
                return done(null, true, {
                    message : "SIGNUP"
                })
            }
            if(user.password != password) {
                return done(null, false, {
                    message: "INCORRECTPASSWORD"
                });
            }
            return done(null, user, null);
        })
    }));
    
};