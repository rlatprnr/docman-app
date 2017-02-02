'use strict';

angular.module('docman.provider-profile', [])

.controller('ProviderProfileCtrl', function ($scope, $stateParams, $timeout, $cordovaFileTransfer, $ionicPlatform, Users, Funds, Docs, DocFile) {

  Users.getUser($stateParams.id).then(function(user){
    $scope.user = user;
    $scope.isUnfollow = false;

    DocFile.downloadWithoutLoading('logo-'+user.id).then(function(url){
      $timeout(function(){
        $scope.user.logo = url;
      });        
    }).catch(function(){});

    Funds.getFundsByUser(user.id).then(function(funds){
      $timeout(function(){
        $scope.user.funds = funds;
        $scope.selectedfundid = funds[0].id;
        $scope.changeFund($scope.selectedfundid);
      });

      funds.forEach(function(fund){
        Docs.getAll(fund.id).then(function(docs){
          $timeout(function(){
            fund.docs = docs;
          });        
        }).catch(function(){
        });
      })
    }).catch(function(){
    }); 

  });

  $scope.changeFund = function(id) {
    for(var key in $scope.user.funds) {
      if ($scope.user.funds[key].id == id) {
        $scope.selectFund = $scope.user.funds[key];
        return;
      }
    }
  }

  $scope.downloadDoc = function(doc) {
    DocFile.download(doc.uploadname).then(function(url){
      if ($ionicPlatform.is('android')) {
        var filePath = url.substr(url.lastIndexOf('/') + 1);
        var targetPath = cordova.file.externalApplicationStorageDirectory + doc.filename;
        var trustHosts = true;
        var options = {};
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
          $cordovaFileOpener2.open(result.toInternalURL(), 'application/pdf');
        }, function (err) {          
        });
      } else {
        if(window.cordova) {
          window.open(url, '_blank', 'location=no,hardwareback=no,enableViewportScale=yes');
        } else {
          window.open(url);
        }
      }
    });    
  }

  $scope.unfollow = function() {
    Users.unfollow($scope.user.id).then(function(){
      $scope.isUnfollow = true;
    })
  }
  
})
