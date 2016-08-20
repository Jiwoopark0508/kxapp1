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
            // pending states
            .state("questions", {
                url: "/template",
                templateUrl: "template/question.html",
                resolve:{
                    questionService: function($http){
                        return $http.get('/type');
                    }
                },
                controller: function(questionService, $location){
                    this.type = questionService.data;
                    let randomIndex = Math.floor(Math.random() * this.type.length);
                    $location.path(`/template/${randomIndex}`);
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
            controller: function($scope, $sce){
                angular.element('[data-toggle="tooltip"]').tooltip();
            }

        };
    });


