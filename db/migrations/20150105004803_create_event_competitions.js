var CreateEventCompetitions = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('number', 'int');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('EventCompetition', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('EventCompetition', callback);
  };
};

exports.CreateEventCompetitions = CreateEventCompetitions;
