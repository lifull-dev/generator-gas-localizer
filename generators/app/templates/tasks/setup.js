let util = require('util')
  , path = require('path')
  , fs = require('fs')
  ;

let dotenv = require('dotenv')
  , google = require('googleapis').google
  , prompts = require('prompts')
  , open = require('open')
  , say = require('yosay')
  ;

dotenv.config();

process.on('uncaughtException', (err) => {
  console.log(err);
});

let config = require('../library/config')
  , token = require('../library/token')
  , clientId = process.env.CLIENT_ID
  , clientSecret = process.env.CLIENT_SECRET
  ;

let readfile = util.promisify(fs.readFile)
  , writefile = util.promisify(fs.writeFile)
  , stat = util.promisify(fs.stat)
  ;

(async () => {

  console.log(say('start setup.\n1. generate token file.\n2. generate source code from remote.'))

  await token.gen()

  let oauth2Client = new google.auth.OAuth2(clientId, clientSecret, config.redirectUrl)
    , script = await google.script({version: 'v1', auth: oauth2Client})
    , tokens = await config.getTokens()
    ;

  oauth2Client.setCredentials({refresh_token: tokens.refresh_token})

  let res = await script.projects.getContent({
    scriptId: config.scriptId
  });

  await writefile(config.remoteFile, JSON.stringify(res.data))

  let remoteCode = JSON.parse(await readfile(config.remoteFile))
    , extMap = {html: 'html', server_js: 'gs'}
    ;

  for (let file of remoteCode.files) {
    let type = file.type.toLowerCase();
    if (type === 'json') { continue; }
    let projectPath = `project/${file.name}.${extMap[type]}`
      , filePath = path.resolve(__dirname, `../${projectPath}`)
      ;

    try {
      await stat(filePath)
      let agree = prompt({
        type: 'confirm',
        name: 'agree',
        message: `${filePath} is already exists. override from remote code?`,
        default: true
      });

      if (!agree) {
        console.log('aborted')
        return;
      }
    } catch(err) {/* 正常系 */}

    await writefile(filePath, file.source);
    console.log(`generated from remtoe code > ${projectPath}`)
  }
})()
