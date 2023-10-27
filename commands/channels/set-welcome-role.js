const config = require("../../utils/config");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-welcome-role")
        .setDescription("Sets the server's welcome role")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        await interaction.reply("Test");
    },
};
