'use strict'

var yelpnode = require("yelp");

var bars = require("../../models/bars.js");
var users = require("../../models/users.js");

var auth = require("../auth/auth.controller.js");

module.exports = function(){
    
    this.login = function(req, res, next){
        users.findOne({"email" : req.body.email}, function(err, user){
            if(err) {
                return next(err);
            }
            if(!user) {
                return res.json({
                    status : "SIGNUP"
                });
            }
            if(req.body.password != user.password){
                return res.json({
                    status : "INCORRECTPASSWORD"
                });
            }
            return res.json({
                status : "CORRECT",
                user : user,
                token : auth.signToken(user._id)
            });
        });
    };
    
    this.getUser = function(req, res, next){
        console.log("get me!!, ", req.user);
        return res.json(req.user);
    };
    
    this.getYelpBars = function(req, res, next){
        var yelp = new yelpnode({
            consumer_key : "Bnz5btZVtbNg7l08Xby9_w",
            consumer_secret : "4XcHYgtBGhS9YbSWZsPBC9jSBDA",
            token:"xQ9YAFYHIMzPkdwoRa_Vit4gASOvqTX2",
            token_secret : "oUMNt7jIzk9DYlriCzunoyU9hVw"
        });
       // console.log(req.params.loc);
        yelp.search({term : "Restaurants", location: req.params.loc}, function(err, data){
            if(err) {
                console.log("Error happened");
                return next(err);
            }
            var rt = data.businesses.map(function(item){
                return {
                    attending : [],
                    url : item.url,
                    img : item.image_url,
                    snippet : item.snippet_text,
                    name : item.name
                }
            });
            return res.json(rt);
        });
    };
    
    this.getBars = function(req, res, next){
      //  console.log(bars);
        bars.find({}, function(err, bars){
            if(err) {
                return next(err);
            }
            return res.json(bars);
        })   
    }
    
    this.addBar = function(req, res, next){
        
        console.log("Adding bar : ", req.body);
        if(req.body.hasOwnProperty("_id")){
            bars.findOne({"_id" : req.body._id}, function(err, bar){
                if(err){
                    return next(err);
                }
                if(!bar) {
                    var svBar = new bars(req.body);
                    svBar.save(function(err, result){
                        if(err) {
                            return next(err);
                        }
                        return res.json(result);
                    });                    
                }else {
                    bar.attending = req.body.attending;
                    bar.save(function(err, result){
                        if(err){
                            return next(err);
                        }
                        return res.json(result);
                    });
                }
            })
        }else {
            var svBar = new bars(req.body);
            svBar.save(function(err, result){
                if(err) {
                    return next(err);
                }
                return res.json(result);
            });
        }
    };
    
    this.updateBar = function(req, res, next){
        var svBar = new bars(req.body);
        svBar._id = req.params.id;
        svBar.save(function(err, result){
            if(err) {
                return next(err);
            }
            return res.json(result);
        });
    };
    
    this.deleteBar = function(req, res, next){
        bars.remove({_id : req.params.id}, function(err, result){
            if(err){
                return next(err);
            }
            return res.json(result);
        });
    };
    
    //user 
    this.updateLoc = function(req, res, next){
      users.findOne({_id : req.params.id}, function(err, user){
          if(err) {
            return next(err);
          }
          if(!user){
              return next(new Error("no such user"));
          }
          user.location = req.body.location;
          console.log("updated user : ", user);
          user.save(function(err, result){
              if(err){
                  return next(err);
              }
              return res.json(result);
          });
      })  
    };
    
    this.addUser = function(req, res, next){
      //  console.log("in addUser");
        users.findOne({'email' : req.body.email}, function(err, result){
            if(err) {
                return next(err);
            }
            if(result) {
                return res.json({
                    status : "SIGNED"
                });
            }else {
                var newuser = new users({
                    email : req.body.email,
                    password : req.body.password,
                    role:  "user", 
                    location : ""
                });
                newuser.save(function(err, usr){
                    if(err) {
                        return next(err);
                    }
                    usr.password = "";
                    console.log("Usr : " + usr);
                    var token  = auth.signToken(usr._id);
                    return res.json({
                        status : "UNSIGNED",
                        token : token,
                        user : usr
                    });
                });
            }
        });
    };
};