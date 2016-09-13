directiveModule
  .directive('jyNavigation', function() {
    return {
      templateUrl: 'jurnywebapp/Shared/Navigation/Navigation.html',
      controller: 'navigationCtrl',
      scope: {
          map: "=map"
      }
    };
  })
  .directive('compareTo', function () {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
  })
  .directive('fileDropzone', function() {
    return {
      restrict: 'A',
      scope: {
        file: '=',
        fileName: '='
      },
      link: function(scope, element, attrs) {
        var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
        processDragOverOrEnter = function(event) {
          if (event != null) {
            event.preventDefault();
          }
          event.dataTransfer.effectAllowed = 'copy';
          return false;
        };
        validMimeTypes = attrs.fileDropzone;
        checkSize = function(size) {
          var _ref;
          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
            return true;
          } else {
            alert("File must be smaller than " + attrs.maxFileSize + " MB");
            return false;
          }
        };
        isTypeValid = function(type) {
          if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
            return true;
          } else {
            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
            return false;
          }
        };
        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        return element.bind('drop', function(event) {
          var file, name, reader, size, type;
          if (event != null) {
            event.preventDefault();
          }
          reader = new FileReader();
          reader.onload = function(evt) {
            if (checkSize(size) && isTypeValid(type)) {
              return scope.$apply(function() {
                scope.file = evt.target.result;
                if (angular.isString(scope.fileName)) {
                  return scope.fileName = name;
                }
              });
            }
          };
          file = event.dataTransfer.files[0];
          name = file.name;
          type = file.type;
          size = file.size;
          reader.readAsDataURL(file);
          return false;
        });
      }
    };
  })
  .directive('placeAutocomplete', function() {
    return {
      templateUrl: 'jurnywebapp/Shared/PlaceAutocomplete.html',
      restrict: 'E',
      replace: true,
      scope: {
        'callback': '='
      },
      controller: function($scope, $q) {
        if (!google || !google.maps) {
          throw new Error('Google Maps JS library is not loaded!');
        } else if (!google.maps.places) {
          throw new Error('Google Maps JS library does not have the Places module');
        }
        var autocompleteService = new google.maps.places.AutocompleteService();
        var map = new google.maps.Map(document.createElement('div'));
        var placeService = new google.maps.places.PlacesService(map);
        var ngModel = {};
        var getResults = function(address) {
          var deferred = $q.defer();
          autocompleteService.getQueryPredictions({
            input: address
          }, function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        };
        var getDetails = function(place) {
          var deferred = $q.defer();
          placeService.getDetails({
            'placeId': place.place_id
          }, function(details) {
            deferred.resolve(details);
          });
          return deferred.promise;
        };
        $scope.search = function(input) {
          if (!input) {
            return;
          }
          return getResults(input).then(function(places) {
            return places;
          });
        };
        $scope.getLatLng = function(place) {
          if (!place) {
            ngModel = {};
            return;
          }
          getDetails(place).then(function(details) {
            ngModel = {
              'name': place.description,
              'latitude': details.geometry.location.lat(),
              'longitude': details.geometry.location.lng(),
            };
            $scope.callback(ngModel);
          });
        }
      }
    };
  });
