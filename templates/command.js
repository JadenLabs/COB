const { logger } = require("../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../utils/lang");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("").setDescription(""),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};
