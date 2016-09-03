homeModule.controller('homeCtrl',function($scope, $ionicHistory){

$ionicHistory.clearHistory();

  console.log($ionicHistory.viewHistory());

});
