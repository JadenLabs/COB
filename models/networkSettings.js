const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const NetworkSettings = sequelize.define("networkSetting", {
    guildId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        required: false,
        defaultValue: false,
    },
    notifsChannel: {
        type: Sequelize.STRING,
        required: false,
        defaultValue: null,
    },
    partnersChannel: {
        type: Sequelize.STRING,
        required: false,
        defaultValue: null,
    },
    serverAd: {
        type: Sequelize.STRING,
        required: false,
        defaultValue: null,
    },
});

module.exports = NetworkSettings;
