let path = require('path')
  , watch = require('watch')
  ;

let target = path.resolve(__dirname, '../project')
  , update = require('../library/update')
  ;

watch.createMonitor(target, {interval: 1}, monitor => {
  monitor.on('created', (f, stat) => {
    console.log(`${target} is changed: [created]`)
    update.update();
  })
  monitor.on('removed', (f, stat) => {
    console.log(`${target} is changed: [removed]`)
    update.update();
  })
  monitor.on('changed', (f, stat) => {
    console.log(`${target} is changed: [changed]`)
    update.update();
  })
})
