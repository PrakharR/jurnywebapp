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
