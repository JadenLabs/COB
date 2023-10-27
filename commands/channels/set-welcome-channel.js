const config = require("../../utils/config");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-welcome-channel")
        .setDescription("Sets the server's welcome channel"),
    async execute(interaction) {
        await interaction.reply("Test");
    },
};
