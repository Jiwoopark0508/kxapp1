"use strict";
import angular from "angular";
import "angular-ui-router";

angular.module("gqApp", ["ui.router"])
    .config( function($stateProvider){

        $stateProvider
            .state("home",{ 
                url: "/home",
                templateUrl: "template/home.html",
                controller: function(){
                    this.hello = "환영합니다.";
                },
                controllerAs: "gqCtrl"
            })
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
                    $location.path(`/template/${this.type.id}`);
                },
                controllerAs: "tempCtrl"
            })
            .state("questions.list", {
                url: "/:type",
                templateUrl: "template/questionList.html",
                resolve:{
                    questionService: function($http, $stateParams){
                        let questionType = $stateParams.type;
                        console.log($stateParams.type);
                        return $http.get(`/type/${questionType}`);
                    }
                },
                controller: function(questionService){
                    this.questionList = questionService.data;
                },
                controllerAs: 'listCtrl' 
            });
    });

