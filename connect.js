const { connect } = require('redibase')
const redibase = connect('redis://redistogo:a5d45d78e406f85cb68d1418528e78e3@pearlfish.redistogo.com:10152')
module.exports = redibase