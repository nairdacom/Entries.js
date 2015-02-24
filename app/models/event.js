var Event = function () {
  var self = this;
  this.defineProperties({
    name: {type: 'string', required: true},
    eventStart: {type: 'date', required: true},
    eventStop: {type: 'date', required: true},
    entriesStart: {type: 'date', required: true},
    entriesStop: {type: 'date', required: true},
    modifyStop: {type: 'date', required: true},
    modifyTimeStop: {type: 'time', required: true},
    clubOnly: {type: 'boolean', required: true},
    freeList: {type: 'boolean', required: true}
  });
  this.hasMany('EventRecords');

  this.getStatusColor = function(){
    var today = new Date();
    this.entriesStop.setHours(23);
    this.entriesStop.setMinutes(59);
    this.modifyStop.setHours(this.modifyTimeStop.getHours());
    this.modifyStop.setMinutes(this.modifyTimeStop.getMinutes());
    if ( this.getStatus() == "notStarted" )  return "#00b";
    if ( this.getStatus() == "finished" )    return "#b00";
    if ( this.getStatus() == "onlyModify" )  return "#bb0";
    else                                    return "#0b0";
  };
  
  this.getStatus = function(){
    var today = new Date();
    this.entriesStop.setHours(23);
    this.entriesStop.setMinutes(59);
    this.modifyStop.setHours(this.modifyTimeStop.getHours());
    this.modifyStop.setMinutes(this.modifyTimeStop.getMinutes());
      
    if ( today < this.entriesStart )                                            return "notStarted";
    else if ( today > this.modifyStop )                                         return "finished";
    else if ( ( today > this.entriesStop ) && ( today <= this.modifyStop ) )    return "onlyModify";
    else                                                                        return "active";
  };
    
  this.validatesWithFunction('eventStop', function(value,model){
    return (model.eventStart<=model.eventStop);
  }, {message: "data końcowa nie może być wcześniej niż data początkowa"});
  this.validatesWithFunction('entriesStart', function(value,model){
    return (model.eventStart>model.entriesStart);
  }, {message: "zgłoszenia muszą się rozpocząć i zakończyć przed rozpoczęciem wydarzenia"});
  this.validatesWithFunction('entriesStop', function(value,model){
    return (model.eventStart>=model.entriesStop);
  }, {message: "zgłoszenia muszą się rozpocząć i zakończyć przed rozpoczęciem wydarzenia"});
this.validatesWithFunction('entriesStop', function(value,model){
    return (model.entriesStart<=model.entriesStop);
  }, {message: "data rozpoczęcia zgłoszeń musi być wcześniejsza od daty zakończenia"});
  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Event.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Event.someStaticMethod = function () {
  // Do some other stuff
};
Event.someStaticProperty = 'YYZ';
*/

Event = geddy.model.register('Event', Event);
