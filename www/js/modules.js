// MAIN MODULES
// Everytime a state or shared module are added, append them to the arrays below respectively
var stateModule = angular.module('state',['directive','service','app','home','login','signup']);
var directiveModule = angular.module('directive',['navigation']);
var serviceModule = angular.module('service',[]);

// STATE MODULES
var appModule = angular.module('app',[]);
var homeModule = angular.module('home',[]);
var loginModule = angular.module('login', []);
var signupModule = angular.module('signup', []);

// SHARED MODULES
var navigationModule = angular.module('navigation', []);
