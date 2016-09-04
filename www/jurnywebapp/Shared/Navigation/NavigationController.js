navigationModule.controller('navigationCtrl',function($scope, $rootScope, $state, $mdSidenav){

  $scope.user = $rootScope.user;
  $scope.signOut = $rootScope.signOut;

  $scope.goToLogIn = function() {
    $state.go('app.login');
  }
  $scope.goToCreate = function() {
    $state.go('app.create');
  }

  $scope.toggleSidenav = function () {
    $mdSidenav('left').toggle();
  }
});
