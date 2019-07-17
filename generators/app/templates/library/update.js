let util = require('util')
  , path = require('path')
  , fs = require('fs')
  ;

let dotenv = require('dotenv')
  , google = require('googleapis').google
  , touch = require('touch')
  ;

dotenv.config();

let config = require('./config')
  , clientId = process.env.CLIENT_ID
  , clientSecret = process.env.CLIENT_SECRET
  ;

process.on('uncaughtException', (err) => {
  console.log(err);
});

let readfile = util.promisify(fs.readFile)
  , writefile = util.promisify(fs.writeFile)
  , readdir = util.promisify(fs.readdir)
  ;

let cache = {}
  ;

module.exports.update = async function () {
  let oauth2Client = await getOauth2Client()
    , script = await google.script({version: 'v1', auth: oauth2Client})
    , remote = JSON.parse(await readfile(config.remoteFile))
    , appsscript = remote.files.find(file => file.type === 'JSON' && file.name === 'appsscript')
    ;

  let pj = await pack(path.resolve(__dirname, '../project'), appsscript)

  await script.projects.updateContent({
    scriptId: config.scriptId,
    requestBody: {
      scriptId: config.scriptId,
      files: pj.files,
    },
  });

  await reload();
}

async function getOauth2Client() {
  let tokens = await config.getTokens()
    , oauth2Client = new google.auth.OAuth2(clientId, clientSecret, config.redirectUrl)
    ;

  oauth2Client.setCredentials({refresh_token: tokens.refresh_token})
  return oauth2Client;
}

async function reload() {
  await touch('./tmp/reload.txt')
  console.log('reloaded')
}

async function pack(pjDir, appsscript) {
  let items = await readdir(pjDir)
    , pj = [appsscript]
    ;

  async function toRecord(file, ext, type) {
    let name = file.replace(`.${ext}`, '');
    let res = {
      name,
      type: type,
      source: await readfile(path.resolve(pjDir, file), 'utf-8')
    }

    return res;
  }

  let gsFiles = items
    .filter(v => /\.gs/.test(v))

  let htmlFiles = items
    .filter(v => /\.html$/.test(v))

  for (let file of gsFiles) {
    let record = await toRecord(file, 'gs', 'SERVER_JS')
    pj.push(record)
  }

  for (let file of htmlFiles) {
    let record = await toRecord(file, 'html', 'HTML')
    pj.push(record)
  }

  return {files: pj}
}
