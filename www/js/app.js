// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('jurnyWebApp', ['ionic','ngMaterial','ngMessages','state'])

.run(function($ionicPlatform,$ionicLoading) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $ionicConfigProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('green')
    .accentPalette('grey', {
      'hue-1': '100'
    })
    .warnPalette('red');

  $ionicConfigProvider.views.maxCache(0);

  $stateProvider
    .state('app', {
      url: '/',
      abstract: true,
      templateUrl: 'jurnywebapp/App.html',
      controller: 'appCtrl'
    })
    .state('app.home', {
      url: '^/home',
      views: {
        'mainContent': {
          templateUrl: 'jurnywebapp/States/Home/Home.html',
          controller: 'homeCtrl'
        }
      }
    })
    .state('app.login', {
      url: '^/login',
      views: {
        'mainContent': {
          templateUrl: 'jurnywebapp/States/Login/Login.html',
          controller: 'loginCtrl'
        }
      }
    })
    .state('app.signup', {
      url: '^/signup',
      views: {
        'mainContent': {
          templateUrl: 'jurnywebapp/States/Signup/Signup.html',
          controller: 'signupCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/home');

})
