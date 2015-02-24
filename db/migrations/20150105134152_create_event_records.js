var CreateEventRecords = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('competition', 'Competition');
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
    this.createTable('EventRecord', def, callback);
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
    this.dropTable('EventRecord', callback);
  };
};

exports.CreateEventRecords = CreateEventRecords;
