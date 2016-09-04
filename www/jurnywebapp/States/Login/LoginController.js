loginModule.controller('loginCtrl',function($scope, $rootScope, $state){

  // Block to check if user is signed in, redirect otherwise
  $scope.goToHome = function() {
    $state.go('app.home');
  }
  if($rootScope.user) {
    $scope.goToHome();
  }

  $scope.goToSignUp = function() {
    $state.go('app.signup');
  }

});
