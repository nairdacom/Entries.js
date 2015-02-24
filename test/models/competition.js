var assert = require('assert')
  , tests
  , Competition = geddy.model.Competition;

tests = {

  'after': function (next) {
    // cleanup DB
    Competition.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var competition = Competition.create({});
    competition.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
