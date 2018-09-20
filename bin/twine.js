#! /usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .command('configure', 'configure Twitter-related credentials')
  .command('lookup', 'lookup things on twitter')
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
