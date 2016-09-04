createModule.controller('createCtrl',function($scope, $rootScope, $state, $cordovaGeolocation, $mdDialog, $timeout){

  // Block to check if user is signed in, redirect otherwise
  $scope.goToLogin = function() {
    $state.go('app.login');
  }
  $scope.goToHome = function() {
    $state.go('app.home');
  }

  $timeout(function() {
    if(!$rootScope.user) {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(false)
          .title('You are not logged in!')
          .textContent('Please login to create a tour.')
          .ariaLabel('Alert Dialog Demo')
          .ok('Login')
          .cancel('Go home')
      ).then(function() {
        $scope.goToLogin();
      }, function() {
        $scope.goToHome();
      });
    }
  }, 2000);

  var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        MapTypeControlOptions: {
          mapTypeIds: []
        },
        disableDefaultUI: true,
        mapTypeControl: false,
        scaleControl: true,
        zoomControl: true
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    }, function(error){
      console.log("Could not get location");
    });
});
