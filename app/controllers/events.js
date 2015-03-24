var Events = function () {
  var self = this;
  //this.before(require('../helpers/passport').requireAuth);
  
  function checkLogin(){
	  if( typeof self.session.get('user') === 'undefined' ) self.redirect('/login');
  }
  
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
    geddy.model.Event.all( {  }, { sort: { eventStart:'desc' } }, function(err, events) {
      for(var i =0; i<events.length; i++){
          events[i].statusColor = events[i].getStatusColor();
      }
      self.respond({events:events, params:params});
    });
  };

  this.add = function (req, resp, params) {
	checkLogin();
    var self = this;
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    geddy.model.Competition.all(function(err,data){
      if(err) throw err;
      self.respond({params:params, competitions:data});
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , event = geddy.model.Event.create(params);
    var evRecs = new Array();
    if (!event.isValid()) {
      this.respondWith(event);
    }
    else {
      event.save(function(err, data) {
        if (err) { throw err; }
        var z = 0;
        for(var i = 0; i < params.competitions.length; i++){
            geddy.model.Competition.first(params.competitions[i], function(err, competition){
                if(competition){
                    //gettinh competition number
                    for(z=0; z < params.competitions.length; z++){
	                    if(competition.id == params.competitions[z]) break;
                    }
                    evRecs[i] = geddy.model.EventRecord.create({competition: competition, number: (z+1) });
                    evRecs[i].save(function(err,dat){
                        event.addEventRecord(dat);
                        event.save(function(err,data){
                            if(i==params.competitions.length)
                                self.respondWith(event, {status: err});
                        });
                    })};
                }
              );
        }
      });
    }
      
      
  };

  this.show = function (req, resp, params) {
	  
    this.user = this.session.get('user');
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      if (!event) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        var recs = new Array();
        event.getEventRecords(function(err,evRecs){ 
	        evRecs.sort(function(a, b) {return a.number - b.number;});
            console.log(evRecs); 
            recs  = evRecs; 
            self.respond({event:event, competitions: recs}); 
        });
      }
    });
  };

  this.edit = function (req, resp, params) {
	checkLogin();
    this.user = this.session.get('user');
    if(!this.user.isAdmin) this.redirect('/');
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      if (!event) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(event);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      event.updateProperties(params);

      if (!event.isValid()) {
        self.respondWith(event);
      }
      else {
        event.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(event, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
	checkLogin();
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      if (!event) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Event.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(event);
        });
      }
    });
  };

};

exports.Events = Events;
