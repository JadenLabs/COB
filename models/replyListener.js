const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ReplyListener = sequelize.define("replyListener", {
    listenerId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    guildId: {
        type: Sequelize.STRING,
        required: true,
    },
    userId: {
        type: Sequelize.STRING,
        required: true,
    },
    messageId: {
        type: Sequelize.STRING,
        required: true,
    },
});

module.exports = ReplyListener;
