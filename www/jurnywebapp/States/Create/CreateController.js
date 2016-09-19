createModule.controller('createCtrl',function($scope, $rootScope, $state, $cordovaGeolocation, $mdDialog, $timeout, $window, $q, $mdPanel){

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

  // Stores reference to panel so that it can be closed outside of panel controller
  $scope.panelRef;

  // Stores the array of markers on the map
  var mapMarkers = [];

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

  var createPinOnMap = function(location) {
    var myLatLng = new google.maps.LatLng(location.lat,location.lon);

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: $scope.map,
      title: location.title,
      icon: 'img/icons/jurny-location-pin.png'
    });

    mapMarkers.push(marker);
  }

  var removePinOnMap = function(index) {
    mapMarkers[index].setMap(null);
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

  $scope.delete = function() {
    $scope.tour.locations.splice($scope.currentIndex, 1);
    removePinOnMap($scope.currentIndex);
    $mdDialog.hide();
  }

  $scope.add = function(valid) {
    if(valid){
      if($scope.isReview) {
        $scope.tour.locations.splice($scope.currentIndex, 1, $scope.newLocation);
      } else {
        $scope.tour.locations.push($scope.newLocation);
        createPinOnMap($scope.newLocation);
      }
      $mdDialog.hide();
    }
  }

  $scope.showLocationDets = function(ev,location) {
    var callback = function(mdPanelRef) {
      $scope.panelRef = mdPanelRef;
    }
    var position = $mdPanel.newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.ABOVE)
        .withOffsetY('-16px');

    var config = {
      attachTo: angular.element(document.body),
      controller: function(mdPanelRef, $scope) {
        callback(mdPanelRef);
        $scope.location = location;
        $scope.goToLocation = function() {
          console.log($scope.location);
        };
      },
      templateUrl: 'panel.html',
      position: position,
      openFrom: ev,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 2,
      propagateContainerEvents: true
    };

    $mdPanel.open(config);
  };

  $scope.hideLocationDets = function(ev) {
    $scope.panelRef.close();
  }

  $scope.finalizeTour = function(ev) {
    var addLatLng = new google.maps.LatLng($scope.tour.locations[0].lat,$scope.tour.locations[0].lon);
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
    $scope.finalizeDialogMap = new google.maps.Map(document.getElementById("finalizeDialogMap"), mapOptions);
    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i<$scope.tour.locations.length;i++) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.tour.locations[i].lat, $scope.tour.locations[i].lon),
        map: $scope.finalizeDialogMap,
        icon: 'img/icons/jurny-location-pin.png'
      });
      bounds.extend(marker.position);
    }

    $scope.finalizeDialogMap.fitBounds(bounds);

    var parentEl = angular.element(document.body);
    $mdDialog.show({
      contentElement: '#finalizeTourDialog',
      parent: parentEl,
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true,
      onRemoving: $scope.dialogClosing
    });
  }

  $scope.finalizeTourConfirmed = function() {
    // createTour();
  }

  var createTour = function() {
    var locationsToSave = [];
    // Get a key for a new Tour.
    var newTourKey = firebase.database().ref().child('tours').push().key;
    var storageRef = firebase.storage().ref();

    var uploadTour = function() {
      var tourToSave = {
        title: $scope.tour.title,
        description: $scope.tour.description,
        locations: locationsToSave
      }
      console.log(tourToSave);
      firebase.database().ref('tours/' + newTourKey).set(tourToSave, function(response) {
        console.log('tour saved!');
      });
    }
    var first = 0;
    var second = 0;
    for (var i=0; i<$scope.tour.locations.length; i++) {
      locationsToSave[i] = {
        title: $scope.tour.locations[i].title,
        description: $scope.tour.locations[i].description,
        lat: $scope.tour.locations[i].lat,
        lon: $scope.tour.locations[i].lon
      };
      var imageCount = 0;
      for (var j=0; j<$scope.tour.locations[i].images.length; j++) {
        first++;
        imageCount++;
        locationsToSave[i].imageCount = imageCount;
        var file = $scope.tour.locations[i].images[j];
        var locationUploadTask = storageRef.child('tours/' + newTourKey + '/locations/' + i + '/' + j + '.png').put(file);
        console.log(locationUploadTask.snapshot.downloadURL);
        locationUploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {

        }, function(error) {
          console.log('location ' + i + 'image ' + j + ' has error');
          console.log(error.code);
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          second++;
          console.log(locationUploadTask.snapshot.downloadURL);
          if (first == second) {
            uploadTour();
          }
        });
      }
    }
  }
});
