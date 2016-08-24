"use strict";
import angular from "angular";
import "angular-ui-router";
import "angular-bootstrap-npm";

let formMaker = require('./formMaker');

angular.module("gqApp", ["ui.router", "ui.bootstrap"])
    .config( function($stateProvider){

        $stateProvider
            // home state ( main page )
            .state("home",{ 
                url: "/home",
                templateUrl: "template/home.html",
                controller: function(){
                    this.hello = "환영합니다.";
                },
                controllerAs: "gqCtrl"
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
                controller: function($scope, $sce,  questionService, subgoalService, $stateParams){
                    this.types = questionService.data;      // bind question template types
                    this.lecture = subgoalService.data;     // bind lecture's subgoal
                    this.lecInterval = +$stateParams.lecInterval; // find current lectueInterval state

                    // set current Question
                    $scope.curQuestion = null;
                    $scope.setStemQuestion = function(category){
                        $scope.curQuestion = category;
                        console.log(category);
                    };

                    // make form with selected question stem
                    $scope.curForm = null;
                    $scope.getForm = function(tempStr, example){
                        $scope.curForm = $sce.trustAsHtml(formMaker(tempStr, example));
                        console.log(formMaker(tempStr, example));
                    };

                    // add and delete completed Questions
                    $scope.questionBox = [];
                    $scope.addQuestion = function(){
                        let blankValue = angular.element("#blank")[0].value;
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
            // state where user listen lecture
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
            // course state ( where students takes course )
            .state("course", {
                url: "/course",
                templateUrl: "template/course.html",
                resolve:{
                    getQuestion: function($http){
                        return $http.get('/type');
                    }
                },
                controller: function(getQuestion){
                    this.types = getQuestion.data; 
                },
                controllerAs: 'courseCtrl'
                
           });
            

    })
    .directive("gqTypetemplate", function(){
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



