
angular.module('docman.fund-model', [])

.service('Funds', function($q, Fund, Loading) {

  this.getAllFunds = function() {
    var promise = firebase.database().ref('/funds')
      .once('value').then(function(snapshot) {
        var funds = [];
        snapshot.forEach(function(data) {
          var info = data.val();
          info.id = data.key;
          info.date = new Date(info.date);
          funds.push(new Fund(info));
        });
        return $q.resolve(funds);
      });

    return Loading.progress(promise);
  }

  this.getFundsByUser = function(uid) {

    var promise = firebase.database().ref('/funds')
      .orderByChild('uid').equalTo(uid)
      .once('value').then(function(snapshot) {
        var funds = [];
        snapshot.forEach(function(data) {
          var info = data.val();
          info.id = data.key;
          info.date = new Date(info.date);
          funds.push(new Fund(info));
        });
        return $q.resolve(funds);
      });

    return Loading.progress(promise); 

  }

  this.getFund = function(fid) {

    var promise = firebase.database().ref('/funds/'+fid)
      .once('value').then(function(snapshot) {
        var info = snapshot.val();
        info.id = snapshot.key;
        info.date = new Date(info.date);
        return $q.resolve(new Fund(info));
      });

    return Loading.progress(promise); 

  }

})

.factory('Fund', function() {

  function Fund (info) {

    this.id = (info && info.id) || null;
    this.uid = (info && info.uid) || null;

    this.full_name = (info && info.full_name) || 'Arowana Asian Fund Limited';
    this.manager = (info && info.manager) || 'Arowana Asset Management Ltd';
    this.advisor = (info && info.advisor) || 'N/A';
    this.fund_strategy = (info && info.fund_strategy) || 'Fund of Funds Asia with China Bias';
    this.regulatory_registrations = (info && info.regulatory_registrations) || 'SFC Type 4 and Type 9';
    this.portpolio_manager = (info && info.portpolio_manager) || 'Pierre Hoebrechts';
    this.coo = (info && info.coo) || 'Russell Davidson';
    this.inception_date = (info && info.inception_date) || 'January 1st 2011';
    this.aum = (info && info.aum) || '40m';
    this.firm_aum = (info && info.firm_aum) || '40m';
    this.administrator = (info && info.administrator) || 'Harmonic';
    this.auditor = (info && info.auditor) || 'KPMG';
    this.prime_broker = (info && info.prime_broker) || 'N/A';
    this.onshore_legal_counsel = (info && info.onshore_legal_counsel) || 'Simmons & Simmons';
    this.offshore_legal_counsel = (info && info.offshore_legal_counsel) || 'Walkers';
    this.subscriptions = (info && info.subscriptions) || 'Monthly';
    this.redemption = (info && info.redemption) || 'Monthly';
    this.notice_period = (info && info.notice_period) || '60 days';
    this.lock_up = (info && info.lock_up) || 'None';
    this.penalty_fee = (info && info.penalty_fee) || '2% within 12 months'
    this.fund_level = (info && info.fund_level) || 'None';
    this.investor_level = (info && info.investor_level) || 'None';
    this.minimum = (info && info.minimum) || '1000,000';
    this.management_pee = (info && info.management_pee) || '0.75%';
    this.performance_fee = (info && info.performance_fee) || '10%';
    this.hurdle_rate = (info && info.hurdle_rate) || '5%';
    this.loss_carry_forward = (info && info.loss_carry_forward) || 'Yes';
    this.high_water_mark = (info && info.high_water_mark) || 'Yes';
    this.bloomberg_ticker = (info && info.bloomberg_ticker) || '';
    this.mtd = (info && info.mtd) || '0%';
    this.ytd = (info && info.ytd) || '0%';
    this.avg = (info && info.avg) || '0%';
    this.strategy = (info && info.strategy) || 'strategy...';

    this.date = (info && info.date) || new Date();
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    this.date_label = this.date.toLocaleDateString("en-US", options);

    this.docs = [];
  }

  return Fund;

})
