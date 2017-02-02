'use strict';

angular.module('docman.doc-model', [])

.service('Docs', function($q, Auth, Doc, Loading) {

  var docsRef = firebase.database().ref('/docs');

  this.getMonthDocs = function(year, month) {

    var from = new Date(year, month).getTime();
    var to = new Date(year, month+1).getTime() - 1;

    var promise = docsRef
      .orderByChild('date').startAt(from).endAt(to)
      .once('value').then(function(snapshot) {
        var docus = [];
        snapshot.forEach(function(data) {
          docus.push(_getDoc(data));
        });
        return $q.resolve(docus);
      });

    return Loading.progress(promise); 

  }

  this.getQuarterDocs = function() {

    var date = new Date();
    var year = date.getFullYear();
    var month = Math.floor((date.getMonth()-1)/4)*4+1;
    var from = new Date(year, month).getTime();
    var to = new Date(year, month+4).getTime() - 1;

    var promise = docsRef
      .orderByChild('date').startAt(from).endAt(to)
      .once('value').then(function(snapshot) {
        var docus = [];
        snapshot.forEach(function(data) {
          docus.push(_getDoc(data));
        });
        return $q.resolve(docus);
      });

    return Loading.progress(promise); 

  }


  /**
   * get all documents
   * @param  uid
   * @return promise
   */
  this.getAll = function(fid) {

    var promise = docsRef
      .orderByChild('fid').equalTo(fid)
      .once('value').then(function(snapshot) {
        var docus = [];
        snapshot.forEach(function(data) {
          docus.push(_getDoc(data));
        });
        return $q.resolve(docus);
      });

    return Loading.progress(promise); 

  }

  /**
   * set document
   * @param doc
   */
  this.setDoc = function(doc) {
    var docRef;
    if (doc.id) {
      docRef = docsRef.child(doc.id);
    } else {
      docRef = docsRef.push();
    }

    doc.id = docRef.key;
    var info = doc.getInfo();
    var promise = docRef.set(info);

    return Loading.progress(promise);
  }

  /**
   * get document information
   * @param  data
   */
  function _getDoc(data) {
    var info = data.val();
    info.id = data.key;
    info.date = new Date(info.date);
    return new Doc(info);
  }

})


.service('DocFile', function($q, Auth, Loading) {

  var storageRef = firebase.storage().ref();

  /**
   * document file upload
   * @param  file
   */
  this.upload = function(file, uploadname) {
    var promise;
    if (file) {
      uploadname = uploadname || Auth.getID() + new Date().getTime() + file.name;
      var uploadTask = storageRef.child(uploadname).put(file, {contentType: file.type});
      promise = $q(function(resolve, reject){
        uploadTask.on('state_changed', null, function(error) {
          reject(error);
        }, function() { 
          resolve(uploadname);
        });
      })
    } else {
      promise =  $q.reject('error');
    }
      
    return Loading.progress(promise);
  }

  this.download = function(filename) {
    var fileReference = storageRef.child(filename);
    var promise = fileReference.getDownloadURL();
    return Loading.progress(promise);
  }

  this.downloadWithoutLoading = function(filename) {
    return storageRef.child(filename).getDownloadURL();
  }

})


.factory('Doc', function(Auth) {

  /**
   * document object
   * @param info
   */
  function Doc (info) {
    this.id = (info && info.id) || null;
    this.uid = (info && info.uid) || Auth.getID();
    this.fid = (info && info.fid);

    this.filename = (info && info.filename) || 'noname';
    this.uploadname = info.uploadname;
    this.date = (info && info.date) || (new Date());
    this.mq = (info && info.mq) || 'm';
    this.mtd = (info && info.mtd) || '0%';
    this.ytd = (info && info.ytd) || '0%';
    this.avg = (info && info.avg) || '0%';

    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    this.date_label = this.date.toLocaleDateString("en-US", options);
  }

  /**
   * get document information
   */
  Doc.prototype.getInfo = function() {
    return {
      uid: this.uid,
      fid: this.fid,
      filename: this.filename,
      uploadname: this.uploadname,
      date: this.date.getTime(),
      mq: this.mq,
      mtd: this.mtd,
      ytd: this.ytd,
      avg: this.avg,
    }
  }

  return Doc;

})
