const parseArgs = require('minimist')
require('dotenv').config()

const options = {
  alias: {
    a: 'account'
  },
  default: {
    account: process.env.DEFAULT_ACCOUNT
  },
  string: ['account']
}

module.exports = () => parseArgs(process.argv.slice(2), options)
