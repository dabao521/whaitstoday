"use strict";

(function(angular){
    angular.module("mainApp")
        .factory("Auth", ['$q', '$http', '$cookieStore', '$resource', 'UserS', '$state','$rootScope',function($q, $http, $cookieStore, $resource, UserS, $state, $rootScope){
            var _isAuthenticated = false,
                _currentUser = undefined;
            
            return {
                authenticate : function(user, token){
                    console.log("user and token : ", user, token);
                    if(user == null || token == null) {
                        return;
                    }
                    _currentUser = user;
                    _isAuthenticated = true;
                    $cookieStore.put("token", token);
                },
                isAuthenticated : function(){
                    return _isAuthenticated && angular.isDefined(_currentUser);
                },
                getUser : function(){
                    return _currentUser;
                },
                isInRole : function(roles){
                    if(!_currentUser || !roles) {
                        return false;
                    }
                    for(var i = 0; i < roles.length; i++) {
                        if(roles.indexOf(_currentUser.role) != -1) {
                            return true;
                        }
                    }
                    return false;
                },
                
                identity:  function(){
                    var deferred = $q.defer();
                    if(angular.isDefined(_currentUser) && _isAuthenticated){
                        deferred.resolve(_currentUser);
                        return deferred.promise;
                    }
                    var token = $cookieStore.get("token");
                    console.log("token : ", token);
                    if(angular.isDefined(token)){
                        console.log("you have valid token");
                        UserS.getResource().get().$promise
                        .then(function(res){
                            console.log("return from me: ", res);
                            if(res){
                                _isAuthenticated = true;
                                _currentUser = res;
                                deferred.resolve(_currentUser);
                            }else {
                                _isAuthenticated = false;
                                _currentUser = undefined;
                                deferred.resolve(null);
                            }
                        });
                        // $http.get("/api/users/me", function(res){
                        //     console.log(res);
                        // }, function(err){
                        //     throw err;
                        // });
                    }else {
                        _isAuthenticated = false;
                        _currentUser = undefined;                        
                        deferred.resolve(null);
                    }
                    return deferred.promise;
                },
                
                authorize: function(){
                    this.identity()
                        .then(function(user){
                            if($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && this.isInRole($rootScope.toState.data.roles)){
                                if(_isAuthenticated) {
                                    $state.go("NoAuth");
                                }else {
                                    $rootScope.returnToState = $rootScope.toState;
                                    $rootScope.returnToStateParams = $rootScope.toStateParams;
                                    $state.go("login");
                                }
                            }
                        })
                },
                
                signup : function(user){
                    return UserS.getResource().signup(user).$promise
                },
                
                login : function(user){
                    var deferred = $q.defer();
                    $http.post("/auth/local", {
                        "email" : user.email,
                        "password" : user.password
                    }).
                    then(function(result){
                        if(result.data.hasOwnProperty("message")){
                            deferred.resolve(false, result.data.message);
                        }else {
                            _isAuthenticated = true;
                            $cookieStore.put("token", result.data.token);
                            UserS.setToken(result.data.token);
                            _currentUser = UserS.getResource().get();
                            deferred.resolve(true);
                        }
                    }).
                    catch(function(){
                        _isAuthenticated  = false;
                        _currentUser = null;
                        deferred.resolve(false);
                    });
                    return deferred.$promise;
                },
                
                logout: function(){
                    console.log("I am logging out!!!");
                    _isAuthenticated = false;
                    _currentUser = null;
                    $cookieStore.remove("token");// stop the token
                }
            };
        }]);
})(window.angular);