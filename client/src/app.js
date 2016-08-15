"use strict";
import angular from "angular";
import "angular-ui-router";

angular.module("gqApp", ["ui.router"])
    .config( function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("home",{ 
                url: "/home",
                templateUrl: "template/home.html",
                controller: function(){
                    this.hello = "환영합니다.";
                },
                controllerAs: "gqCtrl"
            });
    });

