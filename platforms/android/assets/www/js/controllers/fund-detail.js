'use strict';

angular.module('docman.fund-detail', [])

.controller('FundDetailCtrl', function ($scope, $stateParams, $timeout, $cordovaFileTransfer, $ionicPlatform, Funds, Docs, DocFile) {

  Funds.getFund($stateParams.id).then(function(fund){
    $timeout(function(){
      $scope.form = fund;
    });
    Docs.getAll(fund.id).then(function(docs){
      $timeout(function(){
        $scope.docs = docs;
      });        
    }).catch(function(){
    });
  }).catch(function(){
  });  

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

})
