'use strict';

angular.module('docman.landing', [])

  .controller('LandingCtrl', function ($scope, $timeout, Users, Funds, Auth) {

    $scope.funds = [];

    Users.getInvites(Auth.getEmail()).then(function(invites){
      invites.forEach(function (invite) {
        Funds.getFundsByUser(invite.uid).then(function(funds){
          $timeout(function(){
            Array.prototype.push.apply($scope.funds, funds);
          });
        });
      });
    });
    
  })
