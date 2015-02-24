var CreateCompetitions = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 't');
          t.column('description', 'text');
          t.column('slot', 'number');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('Competition', def, callback);
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
    this.dropTable('Competition', callback);
  };
};

exports.CreateCompetitions = CreateCompetitions;
