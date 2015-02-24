var CreateRowers = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('licenceNo', 'string');
          t.column('lastName', 'string');
          t.column('firstName', 'string');
          t.column('club', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('Rower', def, callback);
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
    this.dropTable('Rower', callback);
  };
};

exports.CreateRowers = CreateRowers;
