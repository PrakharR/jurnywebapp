loginModule.controller('loginCtrl',function($scope, $rootScope, $state, $http, Auth){

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
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var userExists = snapshot.val();
        console.log(userExists);
        if (!userExists) {
          $http({
            method: 'GET',
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+token
          }).then(function successCallback(response) {
            console.log(response);
            var registerUser = {
              first_name: response.data.given_name,
              last_name: response.data.family_name,
              email: response.data.email,
              picture: response.data.picture,
              gender: response.data.gender,
              verified_email: response.data.verified_email,
              locale: response.data.locale
            }
            firebase.database().ref('users/' + user.uid).set(registerUser, function(response) {
              $rootScope.logIn(registerUser);
              $scope.goToHome();
            });
          }, function errorCallback(response) {
            console.log('Could not get G+ profile data');
            console.log(response);
          });
        } else {
          $rootScope.logIn(snapshot.val());
          $scope.goToHome();
        }
      });
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(error);
    });
  }

  $scope.doFacebookLogin = function() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      console.log(token);
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var userExists = snapshot.val();
        if (!userExists) {
          $http({
            method: 'GET',
            headers: {
              Authorization: "Bearer " + token
            },
            url: 'https://graph.facebook.com/v2.7/'+user.providerData[0].uid+'/?fields=first_name,last_name,gender,email,birthday,verified,locale'
          }).then(function successCallback(response) {
            console.log(response);
            var registerUser = {
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              email: response.data.email,
              picture: 'https://graph.facebook.com/v2.7/'+user.providerData[0].uid+'/picture?height=200',
              gender: response.data.gender,
              verified_email: response.data.verified,
              locale: response.data.locale
            }
            firebase.database().ref('users/' + user.uid).set(registerUser, function(response) {
              $rootScope.logIn(registerUser);
              $scope.goToHome();
            });
          }, function errorCallback(response) {
            console.log('Could not get Facebook profile data');
            console.log(response);
          });
        } else {
          $rootScope.logIn(snapshot.val());
          $scope.goToHome();
        }
      });
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(error);
      // ...
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
