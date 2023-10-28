const { logger } = require("../utils/roc-logger");
const config = require("../utils/config");
const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger(
            "Bot",
            "Login",
            "Info",
            `Logged in as ${client.user.tag.yellow}`
        );
    },
};
