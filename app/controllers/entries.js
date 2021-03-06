var Entries = function () {
  //this.before(require('../helpers/passport').requireAuth);
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.event = null;
  this.competitions = new Array();
  this.competition = null;
  this.entriesArr = new Array();
  this.rowersList = new Array();
  this.updating = false;
  this.coachList = new Array();
  this.coaches = undefined;
  this.estTime = null;
  var self = this;
  
  function checkLogin(){
	  if( typeof self.session.get('user') === 'undefined' ) self.redirect('/login');
  }
  
  function compareLicence(a,b) {
    if (a.lastName < b.lastName) return -1;
    if (a.lastName > b.lastName) return 1;
    return 0;
  }
  
  function compareClubs(entry,club){
	  for(var i =0; i<entry.rower.length; i++){
		  if(entry.rower[i].club === club) return true;
	  }
	  return false;
  }
  
  this.createCoachList = function(clubOnly,callback){
      if((!clubOnly)||(this.user.isAdmin)||(this.user.club.substr(0,3)=="SMS")){
        geddy.model.Rower.all(function(err,data){
          for(var i=0; i<data.length; i++){
            var rower = data[i];
            if(rower.licenceNo.toUpperCase().search("T") != -1) self.coachList.push(rower);
          }
          self.coachList.sort(compareLicence);
          callback(self.coachList);
        });  
      } else {
        geddy.model.Rower.all({club:self.user.club}, function(err,data){
          for(var i=0; i<data.length; i++){
            var rower = data[i];
            if(rower.licenceNo.toUpperCase().search("T") != -1) self.coachList.push(rower);
          }
          self.coachList.sort(compareLicence);
          callback(self.coachList);
        });  
      }
      
  }
  this.index = function (req, resp, params) {
	checkLogin();
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
       self.event = data;
       geddy.model.Entry.all(function(err,data){
         for(var z = 0; z< data.length; z++){
           if ( (data[z].event!==null) && (data[z].event.id == params.eventId)){
	         var comparedClubs = compareClubs(data[z],self.user.club);
             if((data[z].user.club == self.user.club) || (self.user.isAdmin) || (comparedClubs == true)) { self.entriesArr.push(data[z]); } 
           }
         }
        self.event.getEventRecords(function(err,evRecs){ 
	      self.competitions  = evRecs;  
	      self.competitions.sort(function(a, b) {return a.number - b.number;});
	      self.respond( {params: params}); });
       });
    });
    
  };

  this.add = function (req, resp, params) {
	checkLogin();
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
	checkLogin();
    // Save the resource, then display index page
    this.redirect({controller: this.name});
  };

  this.show = function (req, resp, params) {
    var self = this;
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
       self.event = data;
       geddy.model.Entry.all(function(err,data){
         for(var z = 0; z< data.length; z++){
           if((data[z].event != null)&&(typeof data[z]!==undefined)){
             if(data[z].event.id == params.eventId){
               /*if((data[z].user.club == self.user.club) || (self.user.isAdmin))*/ { self.entriesArr.push(data[z]); } 
             }
           }
         }
         if(self.event.getStatus()=="active") self.redirect("/events/"+this.event.id);
         self.event.getEventRecords(function(err,evRecs){ 
             self.competitions  = evRecs; 
             self.competitions.sort(function(a, b) {return a.number - b.number;});
             self.respond({params: params}); 
         });
       });
    });
  };

  this.edit = function (req, resp, params) {
	checkLogin();
    this.user = this.session.get('user');
    var selfFunc = this, entry = null;
    self.updating = true;
    geddy.model.Entry.first(params.entryId,function(err,data){
        selfFunc.entry = data;
        self.event = data.event;
        self.competition = data.competition;
        self.rowersList = data.rower;
        self.coaches = data.coachList;
        self.estTime = data.estTime;
        if ((self.user.isAdmin) || (!self.event.clubOnly) || (self.user.club.substr(0,3)=="SMS")){
          self.createCoachList(false,function(){
            geddy.model.Rower.all(null, {sort:{lastName:'asc'}},function(err,data){
                self.rowers = data;
                self.respond({params: params},{template: '/entries/new_entry'});
              });
          });
        } else {
          self.createCoachList(true,function(){ 
            geddy.model.Rower.all({club:self.user.club}, {sort:{lastName:'asc'}},function(err,data){
                self.rowers = data;
                self.respond({params: params},{template: '/entries/new_entry'});
              });
          });
        }
        
    });
    
  };

  this.update = function (req, resp, params) {
	checkLogin();
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
	checkLogin();
    geddy.model.Entry.remove(params.entryId,function(err,data){
      self.redirect("/entries/" + params.eventId);
    });  
  };
    
  this.newEntry = function (req, resp, params) {
	  checkLogin();
      this.user = this.session.get('user');
      geddy.model.Event.first(params.eventId, function(err,data){
        self.event = data;
        geddy.model.Competition.first(params.competitionId, function(err,data){
            self.competition = data;
            if ((self.user.isAdmin) || (!self.event.clubOnly) || (self.user.club.substr(0,3)=="SMS")){
                self.createCoachList(false, function(){
                    geddy.model.Rower.all(null, {sort:{lastName:'asc'}},function(err,data){
                        self.rowers = data;
                        self.respond({params: params});});
                    });
                }
            else {
                self.createCoachList(true, function(){
                    geddy.model.Rower.all({club:self.user.club}, {sort:{lastName:'asc'}},function(err,data){
                        self.rowers = data; 
                        self.respond({params: params}); });
                });
            }
        });
      });
  };
  
  this.parseCoaches = function(ids,callback){
      var list = new Array();
      var pushed = false;
      var responses = 0;
      
      if(typeof ids === "undefined") { callback(list); pushed=true; }
      else if(typeof ids === "string"){
	      console.log("######### Typ parametru: "+ (typeof ids));
          geddy.model.Rower.first(ids,function(err,data){
              list.push(data);
              console.log(data);
              pushed=true; 
              callback(list);
          });
      } else {
      
      for(var i =0; i<ids.length; i++){
          geddy.model.Rower.first(ids[i],function(err,data){
              list.push(data);
              responses++;
              if((!pushed) && (responses == ids.length)) { pushed=true; callback(list); }
          }
      )}
      }
  };
    
  this.createEntry = function (req, resp, params) {
	checkLogin();
    // event tworzenia nowego zgłoszenia
    //pobranie wszystkich danych
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
      self.event = data;
      geddy.model.Competition.first(params.competitionId, function(err,data){
        self.competition = data;
        var selfFunc = self;
        self.rowers = new Array();
    
        //zdefiniowanie, czy jeden zawodnik, czy wiecej
        if(typeof params.rower === "string"){
          geddy.model.Rower.first(params.rower, function(err,data){
            selfFunc.rowers.push(data);
            //utworzenie obiektu
            self.parseCoaches(params.coachList, function(list){
                var entryObj = geddy.model.Entry.create({rower:selfFunc.rowers, event:self.event, competition:self.competition, user:self.user, coachList:list, estTime:params.estTime});
                entryObj.save(function(err,dat){ self.redirect("/entries/"+self.event.id); });
            });
          });
        } else {
          parseRowers(params.rower, function(parsedRowers){
	          //utworzenie obiektu
	          console.log(params.coachList);
	          self.parseCoaches(params.coachList,function(list){ 
	            var entryObj = geddy.model.Entry.create({rower:parsedRowers, event:self.event, competition:self.competition, user:self.user,coachList:list, estTime:params.estTime});
	            entryObj.save(function(err,dat){ self.redirect("/entries/"+self.event.id); });
	          });
          });
        }
      });
    });
  }
  
  function parseRowers(viewRowers, callback){
	  var parsedRowers = new Array();
	  var pushed = 0;
	  for(var rNo=0; rNo<viewRowers.length; rNo++){
            geddy.model.Rower.first(viewRowers[rNo], function(err,data){
              parsedRowers.push(data);
              pushed++;
              if(pushed==viewRowers.length) { callback(parsedRowers); } 
            });
          }
  }
  
  this.updateEntry = function (req, resp, params) {
	checkLogin();
    //usuniecie dotychczasowego zgloszenia
    geddy.model.Entry.remove(params.entryId);
      
    // event tworzenia nowego zgłoszenia
      
    //pobranie wszystkich danych
    this.user = this.session.get('user');
    geddy.model.Event.first(params.eventId, function(err,data){
      self.event = data;
      geddy.model.Competition.first(params.competitionId, function(err,data){
        self.competition = data;
        var selfFunc = self;
        selfFunc.rowers = new Array();
        selfFunc.coaches = new Array();
        //zdefiniowanie, czy jeden zawodnik, czy wiecej
        if(typeof params.rower === "string"){
          geddy.model.Rower.first(params.rower, function(err,data){
            selfFunc.rowers.push(data);
            //utworzenie obiektu
            self.parseCoaches(params.coachList, function(list){
                var entryObj = geddy.model.Entry.create({rower:selfFunc.rowers, event:self.event, competition:self.competition, user:self.user, coachList:list, estTime:params.estTime});
                entryObj.save(function(err,dat){ self.redirect("/entries/"+self.event.id); });
            });
          });
        } else {
          parseRowers(params.rower, function(parsedRowers){
	          //utworzenie obiektu
	          self.parseCoaches(params.coachList,function(list){ 
	            var entryObj = geddy.model.Entry.create({rower:parsedRowers, event:self.event, competition:self.competition, user:self.user,coachList:list, estTime:params.estTime});
	            entryObj.save(function(err,dat){ self.redirect("/entries/"+self.event.id); });
	          });
          });
        }
      });   
    });
  }
};

exports.Entries = Entries;

