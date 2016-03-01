var Competitions = function () {
  this.before(require('../helpers/passport').requireAuth);
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.index = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    geddy.model.Competition.all(function(err, competitions) {
      if (err) {
        throw err;
      }
      self.respondWith(competitions, {type:'Competition'});
    });
  };

  this.add = function (req, resp, params) {
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , competition = geddy.model.Competition.create(params);

    if (!competition.isValid()) {
      this.respondWith(competition);
    }
    else {
      competition.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(competition, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Competition.first(params.id, function(err, competition) {
      if (err) {
        throw err;
      }
      if (!competition) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(competition);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
      if(!this.user.isAdmin) this.redirect('/');
    geddy.model.Competition.first(params.id, function(err, competition) {
      if (err) {
        throw err;
      }
      if (!competition) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(competition);
      }
    });
  };

  this.update = function (req, resp, params) {
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    var self = this;
    geddy.model.Competition.first(params.id, function(err, competition) {
      if (err) {
        throw err;
      }
      competition.updateProperties(params);

      if (!competition.isValid()) {
        self.respondWith(competition);
      }
      else {
        competition.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(competition, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    geddy.model.Competition.first(params.id, function(err, competition) {
      if (err) {
        throw err;
      }
      if (!competition) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Competition.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(competition);
        });
      }
    });
  };

};

exports.Competitions = Competitions;
