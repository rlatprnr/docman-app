// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',
  'docman.loading',
  'docman.auth',
  'docman.user-model',
  'docman.fund-model',
  'docman.doc-model',
  'docman.landing',
  'docman.provider-profile',
  'docman.fund-detail',
  'docman.fund-search',
  'docman.publications-search',
  'docman.settings'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // firebase setting

  firebase.initializeApp({
    apiKey: "AIzaSyCs6iT2UqzuAWBG_1WdC9FM4JxV91mgoOE",
    authDomain: "docman-1b904.firebaseapp.com",
    databaseURL: "https://docman-1b904.firebaseio.com",
    storageBucket: "docman-1b904.appspot.com"
  });

  // states settings
  
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    .state('app.landing', {
      url: '/landing',
      views: {
        'menuContent': {
          templateUrl: 'templates/landing.html',
          controller: 'LandingCtrl'
        }
      }
    })

    .state('app.fund-detail', {
      url: '/fund-detail/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/fund-detail.html',
          controller: 'FundDetailCtrl'
        }
      }
    })

    .state('app.provider-profile', {
      url: '/provider-profile/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/provider-profile.html',
          controller: 'ProviderProfileCtrl'
        }
      }
    })

    .state('app.fund-search', {
      url: '/fund-search',
      views: {
        'menuContent': {
          templateUrl: 'templates/fund-search.html',
          controller: 'FundSearchCtrl'
        }
      }
    })

    .state('app.publications-search', {
      url: '/publications-search',
      views: {
        'menuContent': {
          templateUrl: 'templates/publications-search.html',
          controller: 'PublicationsSearchCtrl'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  
})


.controller('LoginCtrl', function($scope, $state, Auth) {

  $scope.email = localStorage.getItem("docman-email");

  $scope.login = function() {
    Auth.setEmail($scope.email);
    $state.go('app.landing');
  }

})


.controller('AppCtrl', function($scope, $http, $window, $timeout, Docs, DocFile) {
  $scope.lang = 'en';
  $scope.langData = {};
  $scope.ui = {};

  $scope.sidewidth = $window.innerWidth / 3;

  // get language data
  $http.get('lang.json',{
  }).then(function(result){
    $scope.langData = result.data;
    $scope.ui = $scope.langData[$scope.lang];
  });

  // set language
  $scope.setLang = function(lang) {
    $scope.lang = lang;
    $scope.ui = $scope.langData[$scope.lang];
  }

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();

  Docs.getMonthDocs(year, month).then(function(docs){
    $scope.monthDocs = docs;
    docs.forEach(function(doc) {
      DocFile.downloadWithoutLoading('logo-'+doc.uid).then(function(url){
        $timeout(function(){
          doc.logo = url;
        });        
      }).catch(function(){});
    });
  });

  Docs.getQuarterDocs().then(function(docs){
    $scope.quearterDocs = docs;
    docs.forEach(function(doc) {
      DocFile.downloadWithoutLoading('logo-'+doc.uid).then(function(url){
        $timeout(function(){
          doc.logo = url;
        });
      }).catch(function(){});
    });
  });

})
