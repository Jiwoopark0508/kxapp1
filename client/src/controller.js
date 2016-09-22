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

function quesCtrl($scope, $http, questionService, subgoalService,
                  $stateParams, $timeout, memoService, userService){
    this.types       = questionService.data;      // bind question template types
    this.lecture     = subgoalService.data;     // bind lecture's subgoal
    this.lecInterval = +$stateParams.lecInterval; 

    let tutChecked   = false;                  // tutChecked or not

    $scope.suggested = this.lecture
                       .lecSubgoal[this.lecInterval]
                       .suggested;
    
    // template description tooltip                    
    angular.element(document).ready(function(){
        if( !tutChecked){
            coursePrompt.tutPrompt();
        }

        $timeout(function(){
            $('[data-toggle="tooltip"]').tooltip();
        }, 100);
    });
    
    $scope.memo = memoService.getMemo();

    // 
    // 1. set current Question Category
    //// set question category 
    $scope.curCategory = null;
    $scope.setStemQuestion = function(category){
        $scope.curCategory = category;
    };
    
    // 
    // 2. set current question template
    //// set specific question template
    $scope.curTemplate = null;
    $scope.setTemplate = function(){
        $scope.selectedQuestion = true;
        $scope.curTemplate = angular.element(this)[0].template;
    }
    //
    // 3. add completed Questions
    //// add question category and question string
    $scope.questionBox = [];
    $scope.addToBox = function(question){ 
        
        $scope.questionBox.push(
                            {"queStr":question, 
                             "queType": $scope.curCategory.typeStr,
                             "queTemplate":$scope.curTemplate,
                             "queAt":+$stateParams.lecInterval,
                             "queBy": userService.getName()});
        clearForm();
    }

    function clearForm(){
        angular.element("#questionForm")[0].value = "";
    }
    // 4. submit question stage
    //// add question box to database
    $scope.submitQuestions = function(){
        $http.post('/submit', $scope.questionBox)
            .then(function(data){
                 console.log(data);
            });  
    };
}

module.exports = {
    testCtrl: testCtrl,
    homeCtrl: homeCtrl,
    courseCtrl: courseCtrl,
    quesCtrl: quesCtrl
};
