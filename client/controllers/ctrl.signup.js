"use strict";

function signupCtrl($scope, Auth, UserS, $state){
    $scope.showErr = false;
    $scope.barListSel = false;
    $scope.settingSel = false;
    $scope.loginSel = false;
    $scope.signupSel = true;
    
    $scope.signup = function(){
        if(!validateEmail($scope.myEmail)) {
            $scope.showErr = true;
            $scope.errInfo = "Not valid email";
            return;
        }
        if(!validatePassword($scope.myPassword)){
            $scope.showErr = true;
            $scope.errInfo = "not valid password, needs 6-15 characters";
            return;
        }
        $scope.showErr = false;
        Auth.signup({
            email: $scope.myEmail,
            password: $scope.myPassword
        })
        .then(function(res){
            console.log(res.status);
            if(res.status == "SIGNED"){
                $scope.showErr = true;
                $scope.errInfo = "Email aleady exsists";
            }else {
                Auth.authenticate(res.user,res.token);
                $scope.showErr = false;
               // $state.go("barList");
               window.location = "/";
            }
        });
    }
    
    function validateEmail(email) {
        return /^[^\@\.]+\@.+\..+$/.test(email);
    }
    
    function validatePassword(pass){
        return pass.length >= 6 && pass.length <= 15;
    }
}