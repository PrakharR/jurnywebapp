loginModule.controller('loginCtrl',function($scope, $rootScope, $state, Auth){

  $scope.isJurnyLogin = false;
  $scope.user = {
    email: null,
    password: null
  }

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

  $scope.doGoogleLogin = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      console.log(user);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  }

  $scope.showJurnyLogIn = function(){
    $scope.isJurnyLogin = true;
  }

  $scope.doJurnyLogIn = function() {
    var email = $scope.user.email;
    var password = $scope.user.password;
    Auth.$signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    }).then(function(user) {
      if(user) {
        var user_id = user.uid;
        firebase.database().ref('users/' + user_id).once('value').then(function(response) {
          $rootScope.logIn(response.val());
          $scope.goToHome();
        });
      } else {
        console.log('There was an error');
      }
    });
  }

});
