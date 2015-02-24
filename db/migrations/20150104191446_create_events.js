var CreateEvents = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('eventStart', 'date');
          t.column('eventStop', 'date');
          t.column('entriesStart', 'date');
          t.column('entriesStop', 'date');
          t.column('modifyStop', 'date');
          t.column('clubOnly', 'boolean');
          t.column('freeList', 'boolean');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('event', def, callback);
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
    this.dropTable('event', callback);
  };
};

exports.CreateEvents = CreateEvents;
