signupModule.controller('signupCtrl',function($scope, $rootScope, $state, Auth, Storage){

  // Block to check if user is signed in, redirect otherwise
  $scope.goToHome = function() {
    $state.go('app.home');
  }
  if($rootScope.user) {
    $scope.goToHome();
  }

  $scope.user = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null
  }
  $scope.password = null;

  $scope.doSignUp = function() {
    var email = $scope.user.email;
    var password = $scope.password;
    Auth.$createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        console.log('The password is too weak.');
      } else {
        console.log(errorMessage);
      }
      console.log(error);
    }).then(function(user) {
      if(user) {
        $scope.user.id = user.uid;
        firebase.database().ref('users/' + $scope.user.id).set($scope.user, function(response) {
          $rootScope.logIn($scope.user);
          $scope.goToHome();
        });
      } else {
        console.log('There was an error');
      }
    });
  }
});
