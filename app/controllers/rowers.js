var Rowers = function () {
  var self = this;
  this.before(require('../helpers/passport').requireAuth);
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
    if(this.user.isAdmin){
        geddy.model.Rower.all(function(err, rowers) {
          if (err) {
            throw err;
          }
          self.respondWith(rowers, {type:'Rower'});
        });
    }
    else {
        if(this.user.club.substr(0,3)=="SMS"){
            geddy.model.Rower.all({sms:this.user.club},function(err, rowers) {
              if (err) {
                throw err;
              }
              self.respondWith(rowers, {type:'Rower'});
            });
        } else {
            geddy.model.Rower.all({club:this.user.club},function(err, rowers) {
              if (err) {
                throw err;
              }
              self.respondWith(rowers, {type:'Rower'});
            });
        }
    }
    
  };

  this.add = function (req, resp, params) {
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , rower = geddy.model.Rower.create(params);

    if (!rower.isValid()) {
      this.respondWith(rower);
    }
    else {
      rower.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(rower, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Rower.first(params.id, function(err, rower) {
      if (err) {
        throw err;
      }
      if (!rower) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(rower);
      }
    });
  };
  
  this.import = function(req,resp, params) {
     var url = "http://licence.rowtiming.com/php-bridge/entries-js.php";
     var self = this;
     this.user = this.session.get('user');
     if(!this.user.isAdmin) this.redirect('/');
     geddy.request({url: url, method: 'GET'}, function (err, data) {
       if (err) { throw err; }
       rowers = JSON.parse(data);
       if (rowers.length > 0) { geddy.model.Rower.remove({}, function(err){
         var savedRowers = 0;
         for(var i=0; i<rowers.length; i++){
           var rower = geddy.model.Rower.create(rowers[i]);
           rower.save(function(err,data){
             savedRowers++;
             if (savedRowers === rowers.length-1) self.redirect('/rowers');
           });
         }
       }); }
     });
  }
  
  this.export = function(req, resp, params) {
	  var self = this;
	  geddy.model.Rower.all(function(err,rowers){
		  var outputString = "";
		  for( var i = 0; i< rowers.length; i++){
			  outputString += rowers[i].licenceNo + ";" + rowers[i].lastName + ";" + rowers[i].firstName + ";" + rowers[i].club + ";" + rowers[i].birthDate + ";\r\n";
		  }
		  self.output(200, {'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="licencje.csv"'},outputString);
		  self.respondWith(req);
	  });
  }
    
  this.edit = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
    geddy.model.Rower.first(params.id, function(err, rower) {
      if (err) {
        throw err;
      }
      if (!rower) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(rower);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Rower.first(params.id, function(err, rower) {
      if (err) {
        throw err;
      }
      rower.updateProperties(params);

      if (!rower.isValid()) {
        self.respondWith(rower);
      }
      else {
        rower.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(rower, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Rower.first(params.id, function(err, rower) {
      if (err) {
        throw err;
      }
      if (!rower) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Rower.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(rower);
        });
      }
    });
  };

};

exports.Rowers = Rowers;
