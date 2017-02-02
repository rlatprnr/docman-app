
angular.module('docman.user-model', [])

.service('Users', function($q, Loading, Auth) {

  var usersRef = firebase.database().ref('/users');

  this.getUser = function(id) {

    var promise = firebase.database().ref('/users/' + id)
      .once('value').then(function(snapshot) {
        var user = snapshot.val();
        user.id = snapshot.key;
        return $q.resolve(user);
      });

    return Loading.progress(promise); 
  }

  this.getInvites = function(email) {

    var promise = firebase.database().ref('/followers')
      .orderByChild('email').equalTo(email)
      .once('value').then(function(snapshot) {
        var invites = [];
        snapshot.forEach(function(data) {
          var info = data.val();
          if (info.activities == 1) {
            info.id = data.key;
            info.date = new Date(info.date);
            invites.push(info);
          }          
        });
        return $q.resolve(invites);
      });

    return Loading.progress(promise);
  }

  this.unfollow = function(uid) {

    var promise = firebase.database().ref('/followers')
      .orderByChild('email').equalTo(Auth.getEmail())
      .once('value').then(function(snapshot){
        snapshot.forEach(function(data) {
          if (data.val().uid == uid) {
            return firebase.database().ref('/followers/' + data.key).update({activities: 0})
          }
        });
      });

    return Loading.progress(promise);
  }

})

