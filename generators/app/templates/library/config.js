let path = require('path')
  , util = require('util')
  , fs = require('fs')
  ;

let readfile = util.promisify(fs.readFile)
  ;

module.exports.scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.scripts",
  "https://www.googleapis.com/auth/script.projects"
];
module.exports.scriptId = "<%= scriptId %>";
/* gas mime type */
module.exports.mimeType = 'application/vnd.google-apps.script+json';
module.exports.redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
/* token file path */
module.exports.tokenFile = path.resolve(__dirname, '../token.json');
module.exports.remoteFile = path.resolve(__dirname, '../remote_code.json')
/* get token */
module.exports.getTokens = async function () {
  let json;
  try {
    json = await readfile(module.exports.tokenFile, 'utf-8');
    return JSON.parse(json).tokens
  } catch(err) {
    console.error('tokenが生成されていません');
    return;
  }
}
