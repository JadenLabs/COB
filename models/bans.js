const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Bans = sequelize.define("ban", {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    adminId: {
        type: Sequelize.INTEGER,
        required: true,
    },
    reason: {
        type: Sequelize.INTEGER,
        required: true,
    },
});

module.exports = Bans;
