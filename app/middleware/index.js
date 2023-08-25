const verifyToken = require('./auth')
const verifySingUp = require('./verifySingUp')

module.exports = {
    verifySingUp: verifySingUp,
    verifyToken: verifyToken
};