var assert = require('assert')
  , tests
  , Rower = geddy.model.Rower;

tests = {

  'after': function (next) {
    // cleanup DB
    Rower.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var rower = Rower.create({});
    rower.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
