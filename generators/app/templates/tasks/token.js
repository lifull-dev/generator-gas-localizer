let util = require('util')
  , path = require('path')
  , fs = require('fs')
  ;

let dotenv = require('dotenv')
  ;

dotenv.config();

process.on('uncaughtException', (err) => {
  console.log(err);
});

let config = require('../library/config')
  , token = require('../library/token')
  ;

(async () => {
  await token.gen()
})()
