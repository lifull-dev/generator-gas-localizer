# generator-gas-localizer

> develop google apps script in local machine.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-gas-localizer using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
git clone git@gitlab.dev.nxin.jp:npm/generator-gas-localizer.git
cd generator-gas-localizer
npm install
npm link
```

Obtain OAuth 2.0 credentials from the [Google API Console](https://console.developers.google.com/?hl=ja).
Then set client id and secret in your shell file.
and source it.

```bash
export GAS_LOCALIZER_CLIENT_ID=xxxxxx
export GAS_LOCALIZER_CLIENT_SECRET=xxxxxx
source ~/.bashrc
```

Then generate your new project:

```bash
yo generator-gas-localizer
```

## setup

```bash
# (in project dir)
npm run setup
```

## deploy

When this command is executed, `project/` is deployed.

```bash
# (in project dir)
npm run update
```

## watch

When this command is executed, it will be deployed when `public/` is changed.

```bash
# (in project dir)
npm run watch
```

## run livereload server

Executing this command will start the livereload server.
[chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

```bash
# (in project dir)
npm run livereload
```

## License

MIT © [NakajimaTakuya](https://github.com/NakajimaTakuya)
