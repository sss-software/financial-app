 /// <reference path="../typings/angularjs/angular.d.ts" /> 
 /// <reference path="../typings/angularjs/angular-route.d.ts" /> 
 /// <reference path="../typings/angularjs/angular-resource.d.ts" /> 
 /// <reference path="../typings/moment/moment.d.ts" /> 
 /// <reference path="ControllerInit.d.ts" /> 

module FinancialApp {
    'use strict';

    export class Program {
        static isInitialized: boolean;

        static init() {
            /// <summary>Initializes the application</summary>

            if (Program.isInitialized === true) {
                throw new Error("App is initialized");
            }

            Program.isInitialized = true;

            // moment language
            moment.lang('nl');

            // define module
            var app: ng.IModule = angular.module('main', ['ngRoute', 'ngMoment']);

            app.config(($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) => {
                // generated routes
                FinancialApp.ControllerInitializer.registerControllerRoutes($routeProvider);

                // special 'now' route
                $routeProvider.when("/now", {
                    redirectTo: Program.createNowRoute()
                });

                // fallback
                $routeProvider.otherwise({
                    redirectTo: '/'
                });

                // use the HTML5 History API (without automatic fallback)
                $locationProvider.html5Mode(true);
            });

            // controllers
            FinancialApp.ControllerInitializer.registerControllers(app);
        }


        static createNowRoute(): string {
            var now: Date = new Date();
            return '/sheet/' + now.getFullYear() + "/" + now.getMonth();
        }
    }
}