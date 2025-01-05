const connection = require("../database/db");

module.exports = class Admin {
    // Admin Login
    static get(where) {
        const { username, password } = where;
        return connection.execute(
            "SELECT username, password FROM admin WHERE username =? AND password =?",
            [username, password]
        );
    }
};
