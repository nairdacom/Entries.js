var CreateEntries = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('rower', 'object');
          t.column('event', 'object');
          t.column('competition', 'object');
          t.column('user', 'object');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('Entry', def, callback);
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
    this.dropTable('Entry', callback);
  };
};

exports.CreateEntries = CreateEntries;
