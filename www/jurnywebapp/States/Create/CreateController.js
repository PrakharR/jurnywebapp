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

  $scope.locations = [
    // {
    //   name: "HKU Main Building",
    //   description: "This is the HKU main building, a place of worship for bookworms.",
    //   picture: "",
    //   lat: "",
    //   lon: ""
    // },
    // {
    //   name: "Subway Sandwiches",
    //   description: "This is the HKU main building, a place of worship for bookworms.",
    //   picture: "",
    //   lat: "",
    //   lon: ""
    // }
  ];

  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 20,
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
    console.log(error);
    console.log("Could not get location");
  });

  $scope.launchCreateLocationDialog = function(ev) {
    var parentEl = angular.element(document.body);
    var addLatLng = $scope.map.getCenter();
    var mapOptions = {
      center: addLatLng,
      zoom: 20,
      MapTypeControlOptions: {
        mapTypeIds: []
      },
      disableDefaultUI: true,
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: false
    };
    $scope.dialogMap = new google.maps.Map(document.getElementById("dialogMap"), mapOptions);

    $mdDialog.show({
      contentElement: '#addLocationDialog',
      parent: parentEl,
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true
    });
  };
  $scope.cancel = function() {
    $mdDialog.hide();
  };
  $scope.add = function() {

  }
});
