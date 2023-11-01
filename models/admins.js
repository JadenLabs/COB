const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Admins = sequelize.define("admin", {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    // 0 - No perms
    // 1 - Manager
    // 2 - Admin
    // 3 - Dev
    // 4 - Owner
    scope: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        required: true,
    },
});

module.exports = Admins;
