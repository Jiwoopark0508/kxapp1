// some requirements
let moment = require('./moment');
let coursePrompt = require('./coursePrompt');

// home Ctrl
// user faces this one they enter the application
function homeCtrl($scope, userService){
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

// course Ctrl
// controller that manages lecture contents
function courseCtrl($scope, subgoalService, $stateParams, $location,
                    $timeout, $interval, memoService){
                                    
    let subgoalList = [];
    let player;
    let start       = 0;
    let curSubgoal  = null;
    let lecNum      = +$stateParams.lecNum;
    let lecInterval = +$stateParams.lecInterval;

    $scope.curSubgoal   = subgoalService
                          .data
                          .lecSubgoal[+$stateParams.lecInterval];
    $scope.lecNum       = lecNum;
    $scope.lecInterval  = lecInterval;
    $scope.setMemo      = function(newMemo){
        memoService.setMemo(newMemo);
    }
  
    angular.element(document).ready(function(){
        // Lectures subgoal List
        subgoalList = subgoalService
                      .data
                      .lecSubgoal;                       
        // subgoal times to seconds                
        subgoalList = subgoalList
                      .map((subgoals) => 
                            moment
                           .duration(subgoals.time)
                            .as('minutes'));
        // Save youtube Player
        player = new YT.Player('player', {  
            height: '390', width: '640',
            videoId:'3nxR6jEI_RA',              
            events : {                         
                'onReady': onPlayerReady
            }
        });
    });

   function onPlayerReady(event){              
        let length = subgoalList[lecInterval] - start;

        start = ( lecInterval > 0 ) ? subgoalList[lecInterval - 1] : 0 ;
 
        $scope.length = length;
        $scope.cur = 0;
        // course prompt should be run when user visits first time. 
        coursePrompt.coursePrompt1(function(){
            player.seekTo(start);
        });

        let playerLoop = $interval(function(){

            let cur = player.getCurrentTime();
            let playTime = (cur - start > 0) ? cur - start : 0;
            $scope.cur = playTime / length * 100;
            // Check for subgoal is done.  
            if( $scope.cur > 100){
                player.pauseVideo();
                $interval.cancel(playerLoop);
                coursePrompt.coursePrompt2($scope.curSubgoal.subgoal);
            }
        }, 1000);

    };
 }

function testCtrl($scope){
    $scope.word = "Test";

}
module.exports = {
    testCtrl: testCtrl,
    homeCtrl: homeCtrl,
    courseCtrl: courseCtrl
};
