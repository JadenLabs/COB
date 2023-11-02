const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const InterviewSettings = sequelize.define("interviewSetting", {
    guildId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    categoryId: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    channelPrefix: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    managerRole: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
});

module.exports = InterviewSettings;
