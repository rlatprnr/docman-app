
angular.module('docman.loading', [])

.service('Loading', function($ionicLoading){

  var self = this;
  var counter = 0;

  this.show = function() {
    if (counter == 0) {
      $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner><br><span>Loading...</span>'});
    }
    counter++;
  }

  this.hide = function() {
    counter--;
    if (counter == 0) {
      $ionicLoading.hide()
    }
  }

  this.progress = function(promise) {
    self.show();
    return promise.then(function(){
      self.hide();
      return promise;
    }).catch(function(){
      self.hide();
      return promise;
    });
  }

})
