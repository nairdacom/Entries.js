var assert = require('assert')
  , tests
  , Event = geddy.model.Event;

tests = {

  'after': function (next) {
    // cleanup DB
    Event.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var event = Event.create({});
    event.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
