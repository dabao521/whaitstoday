"use strict";

function loginCtrl($scope, Auth, $state, $http){
    $scope.showSignup = false;
    $scope.barListSel = false;
    $scope.settingSel = false;
    $scope.loginSel = true;
    $scope.signupSel = false;
    $scope.showErr = false;
    $scope.showSignup = false;
    $scope.login = function(){
       // console.log("cao");
        $http.post("/login", {
            email : $scope.myEmail,
            password : $scope.myPassword
        })
        .then(function(res){
            if(res.data.status == "SIGNUP"){
                $scope.showSignup = true;
                $scope.showErr = false;
            }else if(res.data.status == "INCORRECTPASSWORD"){
                $scope.showSignup = false;
                $scope.showErr = true;
                $scope.errInfo = "Incorrect password, please retry";
            }else {
                Auth.authenticate(res.data.user, res.data.token);
                window.location = "/";
            }
        })
    }
}