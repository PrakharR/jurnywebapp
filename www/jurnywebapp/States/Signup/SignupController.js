signupModule.controller('signupCtrl',function($scope, $state, Storage){

  $scope.user = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null
  }

  $scope.password = null;

  $scope.goToHome = function() {
    $state.go('app.home');
  }

  $scope.doSignUp = function() {
    console.log('submitted');
    var email = $scope.user.email;
    var password = $scope.password;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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
          console.log(response);
          Storage.set('user',$scope.user);
          $scope.goToHome();
        });
      } else {
        console.log('There was an error');
      }
    });
  }
});
