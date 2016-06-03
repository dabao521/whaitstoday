"use strict"

function barListCtrl($scope, Auth, $http, $state, UserS, $cookieStore){
    var location;
    // $scope.isActive = function(loc){
    //   //  console.log(loc);
    //     return loc == $state.current.name;
    // };
    $scope.barListSel = true;
    $scope.settingSel = false;
    $scope.loginSel = false;
    $scope.signupSel = false;
    $scope.isLoading = false;
    $scope.bars = undefined;
    $scope.showErr = false;
    $scope.isAuthenticated = false;
    UserS.setToken($cookieStore.get("token"));
    Auth.identity()
    .then(function(user){
        console.log("authenticate : ", user);
        if(user && !user.hasOwnProperty("err")) {
            $scope.isAuthenticated = true;
            $scope.currentUser = user;
            location = user.location;
            $scope.qLocation = location;
        }else {
            Auth.logout();
          //  $state.go("login");
        }
        if(window.angular.isDefined(location) && location.length != 0) {
            yelpLoadBars(location, $scope);
        }        
    });
    
    $scope.getBars = function(){
        if(Auth.isAuthenticated()) {
            UserS.getResource().updateLocation({'id' : Auth.getUser()._id}, {"location" : $scope.qLocation}).$promise
            .then(function(res){
                if(res.hasOwnProperty("err")) {
                    throw new Error(res.err);
                }
                console.log("user location info has been updated : ", res);
                yelpLoadBars($scope.qLocation, $scope);
            });
        }else {
            yelpLoadBars($scope.qLocation, $scope);
        }
    };
    
    $scope.logout = function(){
        Auth.logout();
        window.location = "/";
    }
    
    $scope.attending = function(index){
         if(!Auth.isAuthenticated()){
             return $state.go("login");
         }
        var isAttended = $scope.bars[index].attending.indexOf(Auth.getUser().email) != -1;
        if(isAttended) {
            console.log("deleting: ", $scope.bars[index]);
            $scope.bars[index].attending.splice($scope.bars[index].attending.indexOf(Auth.getUser().email), 1);
            // var req = {
            //     url : "/api/bars/"  + $scope.bars[index]._id,
            //     method : "DELETE",
            //     headers:{
            //         Authorization : "Bearer "  + $cookieStore.get("token")
            //     }
            // }
            // $http(req)
            // .then()
            // .catch(function(err){
            //     console(err);
            //     $state.go("login");
            // });
        }else {
            $scope.bars[index].attending.push(Auth.getUser().email);
        }
            console.log("insert bar : ", $scope.bars[index]);
            var req = {
                url : "/api/bars/",
                headers: {Authorization : "Bearer " + $cookieStore.get("token")},
                method : "POST",
                data: $scope.bars[index]
            };
            $http(req, $scope.bars[index])
                .then(function(res){
                    if(res.data.hasOwnProperty("err")){
                        Auth.logout();
                        $state.go("barList");
                    }
                    $scope.bars[index] = res.data;
                    console.log("update : ", res.data);
                })
                .catch(function(err){
                    console(err);
                    $state.go("login");
            });
    };
    
    function yelpLoadBars(loc, $scope){
        $scope.isLoading = true;
        $scope.showErr = false;
        $scope.bars = [];
        $http.get("/api/bars/yelp/" + loc)
            .then(function(res){
               // console.log(res);
                var yelpBars = res.data;
                if(yelpBars.hasOwnProperty("err")){
                    $scope.showErr = true;
                    $scope.errInfo = yelpBars.err;
                }
                $http.get("/api/bars")
                    .then(function(result){
                        var rt = [];
                        yelpBars.forEach(function(item){
                            var isThere = false;
                            var index;
                            for(var i = 0; i < result.data.length; i++) {
                                if(result.data[i].name == item.name){
                                    isThere = true;
                                    index = i;
                                    break;
                                }
                            }
                            if(isThere) {
                                item = result.data[index];
                                rt.push(item);
                            }else {
                                rt.push(item);
                            }
                            $scope.isLoading = false;
                            $scope.bars = rt;
                           // console.log($scope.bars);
                        });
                
                    })
                    .catch(function(err){
                        throw err;
                    });
            })
            .catch(function(err){
                throw err;
            });
    }
}