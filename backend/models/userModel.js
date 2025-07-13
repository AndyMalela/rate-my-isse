const db = require('../db');

class UserModel {
    constructor({ username, email, password }) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static updateNameById(id, name, cb) {
        db.run('UPDATE users SET name = ? WHERE id = ?', [name, id], function(err) {
            if (err) return cb(err);
            cb(null, { updated: true });
        });
    }
}

module.exports = UserModel;
