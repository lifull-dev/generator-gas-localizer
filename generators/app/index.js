'use strict';
let path = require('path')
  ;

let Generator = require('yeoman-generator')
  , chalk = require('chalk')
  , yosay = require('yosay')
  ;

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the superb ${chalk.red('generator-gas-localizer')} generator!`)
    );

    this.validate()

    const prompts = [
      {
        type: 'text',
        name: 'name',
        message: 'please input your project name',
        default: path.basename(process.cwd())
      },
      {
        type: 'text',
        name: 'scriptId',
        message: 'please input your script id'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('./library'),
      this.destinationPath('./library')
    );

    this.fs.copyTpl(
      this.templatePath('./library/config.js'),
      this.destinationPath('./library/config.js'),
      {
        scriptId: this.props.scriptId
      }
    );

    this.fs.copy(
      this.templatePath('./project/.gitkeep'),
      this.destinationPath('./project/.gitkeep')
    );

    this.fs.copy(
      this.templatePath('./tmp'),
      this.destinationPath('./tmp')
    );

    this.fs.copy(
      this.templatePath('./tasks'),
      this.destinationPath('./tasks')
    );

    this.fs.copy(
      this.templatePath('./.env'),
      this.destinationPath('./.env')
    );
    this.fs.copyTpl(
      this.templatePath('./.env'),
      this.destinationPath('./.env'),
      {
        clientId: process.env.GAS_LOCALIZER_CLIENT_ID,
        clientSecret: process.env.GAS_LOCALIZER_CLIENT_SECRET
      }
    );

    this.fs.copy(
      this.templatePath('./.gitignore'),
      this.destinationPath('./.gitignore')
    );

    this.fs.copy(
      this.templatePath('./package.json'),
      this.destinationPath('./package.json')
    );
    this.fs.copyTpl(
      this.templatePath('./package.json'),
      this.destinationPath('./package.json'),
      {
        name: this.props.name
      }
    );

    this.fs.copy(
      this.templatePath('./README.md'),
      this.destinationPath('./README.md')
    );
  }

  install() {
    this.installDependencies({
      bower: false
    });
  }

  validate() {
    if (!process.env.GAS_LOCALIZER_CLIENT_ID) {
      throw new Error('set env: GAS_LOCALIZER_CLIENT_ID (See README.md for details)');
    }

    if (!process.env.GAS_LOCALIZER_CLIENT_ID) {
      throw new Error('set env: GAS_LOCALIZER_CLIENT_SECRET (See README.md for details)');
    }

    return true;
  }
};
