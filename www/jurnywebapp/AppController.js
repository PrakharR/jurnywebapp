appModule.controller('appCtrl',function($scope, $rootScope, $state, currentAuth, Storage){
  $rootScope.user = null;

  $scope.initialForm = function() {
    // Get data of current user and put it on rootScope
    var user = currentAuth;
    if (user) {
      $rootScope.user = Storage.get('user');
    } else {
      console.log('user not signed in');
    }
  }

  $rootScope.logIn = function(user) {
    $rootScope.user = user;
    Storage.set('user',user);
  }

  $rootScope.signOut = function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      $rootScope.user = null;
      Storage.remove('user');
      // window.location.reload();
      $state.go('app.home', {}, { reload: true });
    }, function(error) {
      console.log(error);
    });
  }

  $scope.initialForm();
});
