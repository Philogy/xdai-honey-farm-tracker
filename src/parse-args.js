const parseArgs = require('minimist')
require('dotenv').config()

const options = {
  alias: {
    a: 'account',
    s: 'show'
  },
  default: {
    account: process.env.DEFAULT_ACCOUNT
  },
  string: ['account'],
  boolean: ['show']
}

module.exports = () => parseArgs(process.argv.slice(2), options)
