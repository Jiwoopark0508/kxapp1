"use strict";
import angular from "angular";
import "angular-ui-router";
import "angular-bootstrap-npm";

let formMaker = require('./formMaker');                 // Not using any more
let moment = require('./moment');
let coursePrompt = require('./coursePrompt');

let ctrl = require('./controller');
angular.module("gqApp", ["ui.router", "ui.bootstrap"])  // ui.bootstrap not using anymore
    .factory('memoService', function(){
        let memo = "";
        return {
            getMemo: function(){
                return memo;
            },
            setMemo: function(newMemo){
                memo = newMemo;
            }
        }
    })
    .factory('userService', function(){
        let userName = "";
        return {
            getName : function(){
                return userName;
            },
            setName : function(name){
                userName = name;
            }
        }
    })
    .config( function($stateProvider){

        $stateProvider
            // home state ( main page )
            .state("home",{ 
                url: "/home",
                templateUrl: "template/home.html",
                controller: ctrl.homeCtrl, 
                controllerAs: "gqCtrl"
            })
            // course state ( where students takes course )
            .state("course", {
                url: "/course/:lecNum/:lecInterval",
                templateUrl: "template/course.html",
                resolve:{
                    subgoalService: function($http, $stateParams){
                        let lecNum =  $stateParams.lecNum;
                        let lecInterval = $stateParams.lecInterval;
                        return $http.get(`/subgoal/${lecNum}/${lecInterval}`);
                    }

                },
                controller: function($scope, subgoalService, 
                                        $stateParams, $location, $timeout,
                                        $interval, memoService
                                        ){
                                    
                    let subgoalList = [];
                    let player;
                    let start = 0;
                
                    let lecNum = +$stateParams.lecNum;
                    let lecInterval = +$stateParams.lecInterval;


                    $scope.curSubgoal = subgoalService
                                            .data
                                            .lecSubgoal[+$stateParams.lecInterval];
                    $scope.lecNum = lecNum;
                    $scope.lecInterval = lecInterval;
                    // when player ready to play

                    let stateStart = false; 
                    let curSubgoal = null;
                    function onPlayerReady(event){              
                        let length; 
                        let interval = +$stateParams.lecInterval;

                        start = ( interval > 0 ) ? subgoalList[interval - 1] : 0 ;
                        
                        length = subgoalList[interval] - start;
                 
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
                                coursePrompt.coursePrompt2(curSubgoal.subgoal);
                            }
                        }, 1000);

                    };
                   
                    angular.element(document).ready(function(){
                        // Lectures subgoal List
                        subgoalList = subgoalService
                                        .data
                                        .lecSubgoal;                       
                        curSubgoal = subgoalList[lecInterval];
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


                    $scope.setMemo = function(newMemo){
                        memoService.setMemo(newMemo);
                    }
                },
                controllerAs: 'courseCtrl'
                
           })
            // asking question states
            .state("questions", {
                url: "/template/:lecNum/:lecInterval",
                templateUrl: "template/question.html",
                resolve:{
                    questionService: function($http){
                        return $http.get('/type');
                    },
                    subgoalService: function($http, $stateParams){
                        let lecNum = $stateParams.lecNum;
                        let lecInterval = +$stateParams.lecInterval;
                        return $http.get(`/subgoal/${lecNum}/${lecInterval}`);
                    }
                                 

                },
                controller: function($scope, $http,  
                                     questionService, subgoalService,
                                     $stateParams, $timeout,
                                     memoService,
                                     userService){
                    this.types = questionService.data;      // bind question template types
                    this.lecture = subgoalService.data;     // bind lecture's subgoal
                    this.lecInterval = +$stateParams.lecInterval; 

                    let tutChecked = false;                  // tutChecked or not

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
                    // 1. set current Question Category
                    //// set question category 
                    $scope.curCategory = null;
                    $scope.setStemQuestion = function(category){
                        $scope.curCategory = category;
                    };
                    
                    // 2. set current question template
                    //// set specific question template
                    $scope.curTemplate = null;
                    $scope.setTemplate = function(){
                        $scope.selectedQuestion = true;
                        $scope.curTemplate = angular.element(this)[0].template;
                    }
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
                },
                controllerAs: "tempCtrl"
            })
            .state("questions.list", {
                url: "/:type",
                templateUrl: "template/questionList.html",
                resolve:{
                    questionService: function($http, $stateParams){
                        let questionType = $stateParams.type;
                        return $http.get(`/type/${questionType}`);
                    }
                },
                controller: function(questionService, $location){
                    this.questionList = questionService.data[0];
                    
                    this.setQuestion = function(type, number){
                        $location.path(`/lecture/${type}/${number}`);
                    };
                },
                controllerAs: 'listCtrl' 
            })
            // state where user listen lecture ( currently not using )
            .state("lecture", {
                url: "/lecture/:type/:number",
                templateUrl: "template/lecture.html",
                resolve:{
                    getQuestionService: function($http, $stateParams){
                        return $http.get(`/lecture/${$stateParams.type}/${$stateParams.number}`);
                    }
                },
                controller: function($scope, $sce, getQuestionService){
                    $scope.taskTemplate = $sce.trustAsHtml(getQuestionService.data);
                },
                controllerAs: 'lectureCtrl'

            })
           // collected questions ( where instructors can watch students' questions ) 
           .state("instructor", {
                url: "/instructor",
                templateUrl: "template/instructor.html",
                resolve: {
                    getQuestions : function($http){
                        return $http.get('/allQuestions');
                    }
                },
                controller: function($scope, getQuestions){
                    $scope.queList = getQuestions.data;
                }

           })
           .state("wiki_survey", {
                url: "/wiki_survey",
                templateUrl: "template/wiki_survey.html",
                resolve: {
                    getQuestions: function($http){
                        return $http.get('/allQuestions');
                    }
                },
                controller: ctrl.testCtrl
            })

        
        
        ; // End of States
    })
    
    .directive("gqTypetemplate", function(){ // This directive is currently not used.
        return {    
            templateUrl: "template/templateType.html",
            restrict: "E",
            scope:{
                type: "=",
                index: "="
            },
            link: function(scope){
                scope.showTemplates = false;
                scope.toggleTemplates = function(){
                    scope.showTemplates = scope.showTemplates === false ? true: false;
                };
                scope.formMaker = formMaker;

            },
            controller: function(){
                angular.element('[data-toggle="tooltip"]').tooltip();
            }

        };
    });



