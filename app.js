var geddy = require('geddy');

geddy.startCluster({
  hostname: process.env.IP || '127.0.0.1',
  port: process.env.PORT || '3000',
  // you can manually set this to production, or set an environment variable via heroku..
  environment: 'production'
  // just uncomment the below line, and delete the above line.
  // you will need to set an environment variable in heroku by running
  // heroku config:set NODE_ENV=production
  //environment: process.env.NODE_ENV || 'development'
});