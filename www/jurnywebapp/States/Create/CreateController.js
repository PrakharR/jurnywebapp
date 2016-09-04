createModule.controller('createCtrl',function($scope, $ionicHistory, $cordovaGeolocation){
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
