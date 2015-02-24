var Entries = function () {
  this.before(require('../helpers/passport').requireAuth);
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.event = null;
  this.competitions = new Array();
  this.competition = null;
  this.entriesArr = new Array();
  this.rowersList = new Array();
  this.updating = false;
  this.coachList = new Array();
  this.coaches = undefined;
  var self = this;
  
  function compareLicence(a,b) {
    if (a.lastName < b.lastName) return -1;
    if (a.lastName > b.lastName) return 1;
    return 0;
  }
  this.createCoachList = function(clubOnly){
      if((!clubOnly)||(this.user.idAdmin)){
        geddy.model.Rower.all(function(err,data){
          for(var i=0; i<data.length; i++){
            var rower = data[i];
            if(rower.licenceNo.toUpperCase().search("T") != -1) self.coachList.push(rower);
          }
        });  
      } else {
        geddy.model.Rower.all({club:self.user.club}, function(err,data){
          for(var i=0; i<data.length; i++){
            var rower = data[i];
            if(rower.licenceNo.toUpperCase().search("T") != -1) self.coachList.push(rower);
          }
        });  
      }
      self.coachList.sort(compareLicence);
  }
  this.index = function (req, resp, params) {
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
       self.event = data;
    });
    geddy.model.Entry.all(function(err,data){
      for(var z = 0; z< data.length; z++){
        if(data[z].event.id == params.eventId){
          if((data[z].user.club == self.user.club) || (self.user.isAdmin)) { self.entriesArr.push(data[z]); } 
        }
      }
    });
    this.event.getEventRecords(function(err,evRecs){ self.competitions  = evRecs; });
    this.respond({params: params});
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    // Save the resource, then display index page
    this.redirect({controller: this.name});
  };

  this.show = function (req, resp, params) {
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
       self.event = data;
    });
    geddy.model.Entry.all(function(err,data){
      for(var z = 0; z< data.length; z++){
        if(data[z].event.id == params.eventId){
          if((data[z].user.club == self.user.club) || (self.user.isAdmin)) { self.entriesArr.push(data[z]); } 
        }
      }
    });
    if(this.event.getStatus()=="active") this.redirect("/events/"+this.event.id);
    this.event.getEventRecords(function(err,evRecs){ self.competitions  = evRecs; });
    this.respond({params: params});
      
  };

  this.edit = function (req, resp, params) {
    this.user = this.session.get('user');
    var selfFunc = this, entry = null;
    self.updating = true;
    geddy.model.Entry.first(params.entryId,function(err,data){
        selfFunc.entry = data;
        self.event = data.event;
        self.competition = data.competition;
        self.rowersList = data.rower;
        self.coaches = data.coachList;
        if ((self.user.isAdmin) || (!self.event.clubOnly)){
          self.createCoachList(false);
          geddy.model.Rower.all(null, {sort:{lastName:'asc'}},function(err,data){
            self.rowers = data;
          });
        } else {
          self.createCoachList(true);
          geddy.model.Rower.all({club:self.user.club}, {sort:{lastName:'asc'}},function(err,data){
            self.rowers = data;
          });
        }
        
    });
    this.respond({params: params},{template: '/entries/new_entry'});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
    geddy.model.Entry.remove(params.entryId,function(err,data){
      self.redirect("/entries/" + params.eventId);
    });  
  };
    
  this.newEntry = function (req, resp, params) {
      this.user = this.session.get('user');
      geddy.model.Event.first(params.eventId, function(err,data){
        self.event = data;
      });
      geddy.model.Competition.first(params.competitionId, function(err,data){
        self.competition = data;
      });
      if ((this.user.isAdmin) || (!this.event.clubOnly)){
          self.createCoachList(false);
          geddy.model.Rower.all(null, {sort:{lastName:'asc'}},function(err,data){
            self.rowers = data;
          });
      }
      else {
          self.createCoachList(true);
          geddy.model.Rower.all({club:self.user.club}, {sort:{lastName:'asc'}},function(err,data){
            self.rowers = data;
          });
      }
      this.respond({params: params});
  };
  
  this.createEntry = function (req, resp, params) {
    // event tworzenia nowego zgłoszenia
    //pobranie wszystkich danych
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
      self.event = data;
    });
    geddy.model.Competition.first(params.competitionId, function(err,data){
      self.competition = data;
    });
    var selfFunc = this;
    this.rowers = new Array();
    
    //zdefiniowanie, czy jeden zawodnik, czy wiecej
    if(typeof params.rower === "string"){
      geddy.model.Rower.first(params.rower, function(err,data){
        selfFunc.rowers.push(data);
      });
    }
    else {
      for(var rNo=0; rNo<params.rower.length; rNo++){
        geddy.model.Rower.first(params.rower[rNo], function(err,data){
          selfFunc.rowers.push(data);
        });
      }
    }
    
    //utworzenie obiektu
    var entryObj = geddy.model.Entry.create({rower:selfFunc.rowers, event:self.event, competition:self.competition, user:this.user});
    entryObj.save();
      
    // przekierowanie
    this.redirect("/entries/"+self.event.id);
  }
  
  this.updateEntry = function (req, resp, params) {
    //usuniecie dotychczasowego zgloszenia
    geddy.model.Entry.remove(params.entryId);
      
    // event tworzenia nowego zgłoszenia
      
    //pobranie wszystkich danych
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
      self.event = data;
    });
    geddy.model.Competition.first(params.competitionId, function(err,data){
      self.competition = data;
    });
    var selfFunc = this;
    this.rowers = new Array();
    this.coaches = new Array();
    //zdefiniowanie, czy jeden zawodnik, czy wiecej
    if(typeof params.rower === "string"){
      geddy.model.Rower.first(params.rower, function(err,data){
        selfFunc.rowers.push(data);
      });
    }
    else {
      for(var rNo=0; rNo<params.rower.length; rNo++){
        geddy.model.Rower.first(params.rower[rNo], function(err,data){
          selfFunc.rowers.push(data);
        });
      }
    }
      
    if(typeof params.coachList === "string"){ 
        geddy.model.Rower.first(params.coachList, function(err,data){ selfFunc.coaches.push(data); }); 
    } else { 
        for(var cNo=0; cNo<params.coachList.length; cNo++){
        geddy.model.Rower.first(params.coachList[cNo], function(err,data){ selfFunc.coaches.push(data); }); }}
    
    //utworzenie obiektu
    var entryObj = geddy.model.Entry.create({rower:selfFunc.rowers, event:self.event, competition:self.competition, user:this.user, coachList:selfFunc.coaches});
    entryObj.save();
      
    // przekierowanie
    this.redirect("/entries/"+self.event.id);
  }

};

exports.Entries = Entries;

