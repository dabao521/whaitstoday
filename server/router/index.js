'use strict';

var auth = require("../auth/auth.controller.js");
var ctrlClass = require("../controllers/controller.server.js")

module.exports = function(app, passport){
    var ctrl = new ctrlClass();
// auth passport routes    
    // app.post("/auth/local", passport.authenticate("local", {
    //     successRedirect : "/",
    //     failureRedirect : "/login",
    //     failureFlash : true
    // }));
    
    app.post("/auth/local", passport.authenticate("local",{
        failureRedirect : "/"
    }), function(req, res, next){
        console.log("return from passport:", req.user);
    });
    
    app.post("/login", ctrl.login);
    
    //api for npResource // not done yet
    //users 
    app.get("/api/users/me", auth.isAuthenticated(), ctrl.getUser);
    app.put("/api/users/:id", auth.isAuthenticated(), ctrl.updateLoc);
    app.post("/api/users/", ctrl.addUser);//for sign up
    app.delete("/api/users");
    
    //bars
    
    app.get("/api/bars/yelp/:loc", ctrl.getYelpBars);
    app.get("/api/bars", ctrl.getBars);
    app.post("/api/bars/",auth.isAuthenticated(), ctrl.addBar);
    app.put("/api/bars/:id", auth.isAuthenticated(), ctrl.updateBar);
    app.delete("/api/bars/:id", auth.isAuthenticated(), ctrl.deleteBar);
    
    //default
    app.get("/", function(req ,res, next){
       console.log("INFO: Sending index.html");
       return res.sendFile(process.cwd()  + "/public/index.html"); 
    });
    
    app.use(function(err, req, res, next){
        if(err) {
            console.log("INFO: error generated : " + err);
            return res.send(401);
        }
        return next();
    })
}