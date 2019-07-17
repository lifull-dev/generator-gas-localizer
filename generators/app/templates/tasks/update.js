let path = require('path')
  ;

let target = path.resolve(__dirname, '../project')
  , update = require('../library/update')
  ;

update.update();
