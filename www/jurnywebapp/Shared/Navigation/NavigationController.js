navigationModule.controller('navigationCtrl',function($scope, $state, $mdSidenav, Storage){

  $scope.user;

  $scope.initialForm = function() {
    var user = firebase.auth().currentUser;
    if (user) {
      // User is signed in.
      $scope.user = Storage.get('user');
    } else {
      // No user is signed in.
      $scope.user = null;
    }
  }

  $scope.goToLogIn = function() {
    $state.go('app.login');
  }

  $scope.toggleSidenav = function () {
    $mdSidenav('left').toggle();
  }

  $scope.initialForm();
});
