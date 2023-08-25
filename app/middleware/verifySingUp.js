const db = require('../models')
const User = db.users

function verifySingUp(email) {

    return User.findOne({ where: { email } })
        .then(user => {
            return user === null ? false: {"id": user.id};
        })
        .catch(error => {
            throw error;
        });
}

module.exports = verifySingUp;