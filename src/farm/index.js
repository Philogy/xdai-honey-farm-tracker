const HoneyFarmAbi = require('./abi.json')
const { createCallEncoder } = require('easy-multicall')

module.exports = createCallEncoder(HoneyFarmAbi, '0xB44825cF0d8D4dD552f2434056c41582415AaAa1')
