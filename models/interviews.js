const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Interviews = sequelize.define("interview", {
    guildId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    channelId: {
        type: Sequelize.STRING,
        unique: true,
    },
});

module.exports = Interviews;
