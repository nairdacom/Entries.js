var File = function () {
  this.up = function (next) {
    next();
  };

  this.down = function (next) {
    next();
  };
};

exports.File = File;
