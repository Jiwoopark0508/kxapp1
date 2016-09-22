"use strict";
import angular from "angular";
import "angular-ui-router";
import "angular-bootstrap-npm";

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
                controller: ctrl.courseCtrl, 
                                    
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
                controller:   ctrl.quesCtrl,
                controllerAs: "tempCtrl"
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



