
angular.module('docman.auth', [])

.service('Auth', function($q, $injector, $window) {

  var _email = null;

  this.setEmail = function(email) {
    _email = email;
    localStorage.setItem('docman-email', email);
  }

  this.getEmail = function() {
    if (_email == null) {
      _email = localStorage.getItem('docman-email');
    }
    return _email;
  }



  this.signUp = function(info) {

    var promise = Users.getUserByName(info.username).then(function(user) {
      if (user) {
        return $q.reject('Someone already has this username.');
      }

      var newUser = {
        email: info.email.trim(),
        password: info.password,
      };

      return Users.setUser(newUser).then(function(user) {
        _setUser(user);
        return $q.resolve(user);
      });
    });

    return Loading.progress(promise);
  }


  this.signIn = function(username, password) {

    var promise = Users.getUserByNameAndPass(username, password).then(function(user) {
      if (!user) {
        return $q.reject('That username or password is incorrect.');
      }
      _setUser(user);
      return $q.resolve(user);
    });

    return Loading.progress(promise);
  }


  this.signOut = function() {
    _setUser();
    $injector.get('$state').go('login.signin');
  }

})
