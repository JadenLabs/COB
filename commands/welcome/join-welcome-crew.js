const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { SlashCommandBuilder } = require("discord.js");
const WelcomeSettings = require("../../models/welcomeSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join-welcome-crew")
        .setDescription("Gives you the welcome ping role!"),
    async execute(interaction) {
        const { member, guild } = interaction;

        const [welcomeSettings, created] = await WelcomeSettings.findOrCreate({
            where: { guildId: guild.id },
        });

        if (welcomeSettings.enabled === "0") {
            return interaction.reply({
                content:
                    "It looks like this server's welcome module has been disabled.",
                ephemeral: true,
            });
        } else if (created) {
            return interaction.reply({
                content:
                    "It looks like the bot settings haven't been set up; if you're an admin, run /settings to get started.",
                ephemeral: true,
            });
        } else if (!welcomeSettings.welcomeRole) {
            return interaction.reply({
                content:
                    "It looks like the welcome role has not been set up; if you're an admin, run /set-welcome-role to get started.",
                ephemeral: true,
            });
        }

        const pingRole = await guild.roles.fetch(welcomeSettings.welcomeRole);
        if (!pingRole)
            return interaction.reply({
                content:
                    "It looks like the welcome role doesn't exist, or I don't have the needed perms for this operation.",
                ephemeral: true,
            });
        await member.roles.add(pingRole);

        return interaction.reply({
            content: `You have been given the ${pingRole} role!`,
            ephemeral: true,
        });
    },
};
