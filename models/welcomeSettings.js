const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const WelcomeSettings = sequelize.define("welcomeSetting", {
    guildId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    welcomeChannel: {
        type: Sequelize.STRING,
        required: false,
    },
    welcomeRole: {
        type: Sequelize.STRING,
        required: false,
    },
});

module.exports = WelcomeSettings;
