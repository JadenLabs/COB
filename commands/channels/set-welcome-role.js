const config = require("../../utils/config");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-welcome-role")
        .setDescription("Sets the server's welcome role"),
    async execute(interaction) {
        await interaction.reply("Test");
    },
};
