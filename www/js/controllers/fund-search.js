'use strict';

angular.module('docman.fund-search', [])

	.controller('FundSearchCtrl', function ($scope, $state, $timeout, Funds, Fund) {
    $scope.search = function() {
      $scope.funds = [];
      if (!$scope.search_key) return;
      Funds.getAllFunds().then(function(funds){
        $timeout(function(){
          funds.forEach(function(fund){
            if (fund.full_name.toLowerCase().includes($scope.search_key.toLowerCase())) {
              $scope.funds.push(fund);
            }            
          })
        })        
      }).catch(function(){
      });
    }

  })
