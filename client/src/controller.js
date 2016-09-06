function homeCtrl($scope){
     
    $scope.setUser = function(name){
        userService.setName(name);
        console.log(userService.getName());
    }
    $scope.sendCookie = function(userName){
        $http.get(`/user/${userName}`)
                .then(function(data){
                    console.log(data);
                });
    }
    this.hello = "Welcome to Join us";

};
function courseCtrl($scope, subgoalService, $stateParams, $location
                    $timeout, $interval, memoService){

}
function testCtrl($scope){
    $scope.word = "Test";

}
module.exports = {
    testCtrl: testCtrl,
    homeCtrl: homeCtrl
};
