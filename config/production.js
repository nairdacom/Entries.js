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

var config = {
  appName: 'Geddy App'
, detailedErrors: true
, hostname: process.env.IP || "0.0.0.0"
, port: process.env.PORT || 80
    
/*, model: {
    defaultAdapter: 'filesystem'
  }
, sessions: {
    store: 'filesystem'
  , filename: '_session_store.json'
  , key: 'sid'
  , expiry: 14 * 24 * 60 * 60
  }
    */
, model: {
    defaultAdapter: 'mongo'
  }
, db: {
    mongo: {
      username: 'nairdacom'
    , dbname: 'entres-js'
    , prefix: null
    , password: 'GDRKZ27g'
    , host: 'ds047911.mongolab.com'
    , port: 47911
    }
  }
, sessions: {
    store: 'cookie'
  , key: 'sid'
  , expiry: 14 * 24 * 60 * 60
  }

/* // Using Postgres as the default, with only a Postgres DB
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: process.env.USER
    , database: process.env.USER
    , password: null
    , host: null
    , port: 5432
    , ssl: true
    }
  }
*/

/* // Using MySQL as the default, with only a MySQL DB
, model: {
    defaultAdapter: 'mysql'
  }
, db: {
    mysql: {
      host: 'localhost'
    , user: process.env.USER
    , database: process.env.USER
    , password: null
    }
  }
*/

/* // Using Postgres as the default, with both Postgres and Riak
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: process.env.USER
    , database: process.env.USER
    , password: null
    , host: null
    , port: 5432
    }
  , riak: {
      protocol: 'http'
    , host: 'localhost'
    , port: 8098
  }
  }
*/
};

module.exports = config;


