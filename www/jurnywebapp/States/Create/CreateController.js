createModule.controller('createCtrl',function($scope, $rootScope, $state, $cordovaGeolocation, $mdDialog, $timeout, $window, $q){

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

  $scope.tour = {
    title: '',
    description: '',
    locations: []
  }

  // Variable to store index of location currently being viewed
  $scope.currentIndex;

  // Google places search callback
  $scope.location;
  $scope.locationSelectedFromSearch = function(location) {
    centerMapOnLatLng(location.latitude,location.longitude);
  }

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

  var centerMapOnLatLng = function(lat,lng) {
    $scope.map.setCenter({lat: lat, lng: lng});
  }

  $scope.reviewLocation = function(ev,location,index) {
    $scope.launchCreateLocationDialog(ev,location);
    $scope.currentIndex = index;
  }

  $scope.launchCreateLocationDialog = function(ev,location) {
    var parentEl = angular.element(document.body);
    var addLatLng;
    if(location) {
      addLatLng = new google.maps.LatLng(location.lat,location.lon);
      $scope.newLocation = location;
      $scope.isReview = true;
    }else {
      addLatLng = $scope.map.getCenter();
      $scope.newLocation = {
        title: '',
        description: '',
        lat: addLatLng.lat(),
        lon: addLatLng.lng(),
        images: []
      }
      $scope.isReview = false;
    }
    var mapOptions = {
      center: addLatLng,
      zoom: 18,
      MapTypeControlOptions: {
        mapTypeIds: []
      },
      disableDefaultUI: true,
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: false,
      clickableIcons: false
    };
    $scope.dialogMap = new google.maps.Map(document.getElementById("dialogMap"), mapOptions);

    // Handling for image upload
    // Reference: https://github.com/danialfarid/ng-file-upload
    $scope.draggedImages = [];
    $scope.selectedImages = [];
    $scope.maxFiles = 18;

    $scope.imageSelected = function(method) {
      if(method == 'drag') {
        $scope.newLocation.images.push.apply($scope.newLocation.images,$scope.draggedImages);
      } else if(method == 'select') {
        $scope.newLocation.images.push.apply($scope.newLocation.images,$scope.selectedImages);
      }
      $scope.draggedImages = [];
      $scope.selectedImages = [];
      $scope.maxFiles = 18 - $scope.newLocation.images.length;
      if($scope.maxFiles <= 0) {
        // $scope.disableImageUpload = true;
      }
    }

    $mdDialog.show({
      contentElement: '#addLocationDialog',
      parent: parentEl,
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true,
      onRemoving: $scope.dialogClosing
    });
  };

  $scope.dialogClosing = function() {
    $scope.selectedTabIndex = 0;
  }

  $scope.cancel = function() {
    $scope.newLocation = null;
    $mdDialog.hide();
  };

  $scope.add = function() {
    if($scope.isReview) {
      $scope.tour.locations.splice($scope.currentIndex, 1, $scope.newLocation);
    } else {
      $scope.tour.locations.push($scope.newLocation);
    }
    $mdDialog.hide();
  }
});
