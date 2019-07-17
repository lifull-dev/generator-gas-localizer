let util = require('util')
  , path = require('path')
  , fs = require('fs')
  ;

let dotenv = require('dotenv')
  , google = require('googleapis').google
  , prompts = require('prompts')
  , open = require('open')
  ;

dotenv.config();

process.on('uncaughtException', (err) => {
  console.log(err);
});

let config = require('./config')
  , clientId = process.env.CLIENT_ID
  , clientSecret = process.env.CLIENT_SECRET
  , oauth2Client = new google.auth.OAuth2(clientId, clientSecret, config.redirectUrl)
  ;

let readfile = util.promisify(fs.readFile)
  , writefile = util.promisify(fs.writeFile)
  ;

module.exports.gen = async function () {
  let url = oauth2Client.generateAuthUrl({access_type: 'offline', scope: config.scopes})
    ;

  open(url)

  let answer = await prompts({
    type: 'text',
    name: 'code',
    message: `以下のurlを開いてtokenを取得してください\n${url}`
  })

  let tokens = await oauth2Client.getToken(answer.code)

  await writefile(path.resolve(__dirname, '../token.json'), JSON.stringify(tokens));
}
