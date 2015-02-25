/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
var strategies = require('../helpers/passport/strategies')
  , authTypes = geddy.mixin(strategies, {local: {name: 'local account'}});;

var Main = function () {
  this.index = function (req, resp, params) {
    var self = this
      , User = geddy.model.User;
    
      //debug mode
      console.log("\n\n-------- Debug Info --------\n\n");
      var mongo = geddy.model.adapters.mongo.client;
      mongo.connect("mongodb://nairdacom:GDRKZ27g@ds047911.mongolab.com:47911/entries-js", function(err, db) {
            console.log(err);
            console.log(db);
      });
      //debug mode
      
    User.first({id: this.session.get('userId')}, function (err, user) {
      var data = {
        user: null
      , authType: null
      };
      if (user) {
        data.user = user;
        self.session.set('user',user);
        data.authType = authTypes[self.session.get('authType')].name;
      }
      self.respond(data, {
        format: 'html'
      , template: 'app/views/main/index'
      });
    });
  };

  this.login = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/login'
    });
  };

  this.logout = function (req, resp, params) {
    this.session.unset('userId');
    this.session.unset('authType');
    this.session.unset('user');
    this.respond(params, {format: 'html', template: 'app/views/main/logout'});
  };
  
  this.contact = function(req, resp, params){
    this.user = this.session.get('user');
    this.respond(params, {format:'html', template: 'app/views/main/contact'});
  }
};

exports.Main = Main;


