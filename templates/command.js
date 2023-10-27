const config = require("../../utils/config");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("")
        .setDescription(""),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};
