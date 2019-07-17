let path = require('path')
  ;

let reload = require('livereload')
  , server = reload.createServer({debug: true, exts: ['txt']})
  ;

server.watch(path.resolve(__dirname, '../tmp'))
