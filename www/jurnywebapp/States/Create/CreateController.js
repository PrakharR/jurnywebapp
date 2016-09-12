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

  // MAPS SEARCH BLOCK START

  var gmapsService = new google.maps.places.AutocompleteService();

  $scope.search = function(address) {
    var deferred = $q.defer();
    if(address.length > 0) {
      getResults(address).then(
        function (predictions) {
          var results = [];
          for (var i = 0, prediction; prediction = predictions[i]; i++) {
            results.push(prediction.description);
          }
          deferred.resolve(results);
        }
      );
    } else {deferred.resolve({});}
   return deferred.promise;
  }

  function getResults(address) {
    var deferred = $q.defer();
    gmapsService.getQueryPredictions({input: address}, function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  }

  $scope.searchLocationSelected = function() {
    // var autocomplete = new google.maps.places.Autocomplete($scope.selectedItem);
    // var place = gmapsService.getPlace();
    // console.log(place);
  }

  // MAPS SEARCH BLOCK END

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

    $scope.newLocation = {
      title: '',
      description: '',
      lat: addLatLng.lat(),
      lon: addLatLng.lng(),
      image: ''
    }

    $mdDialog.show({
      contentElement: '#addLocationDialog',
      parent: parentEl,
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true
    });
  };

  $scope.cancel = function() {
    $scope.newLocation = null;
    $mdDialog.hide();
  };
  $scope.add = function() {
    $scope.tour.locations.push($scope.newLocation);
    $mdDialog.hide();
    console.log($scope.tour);
  }
});
