loginModule.controller('loginCtrl',function($scope, $state){

  $scope.goToSignUp = function() {
    $state.go('app.signup');
  }

});
