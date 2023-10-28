const { logger } = require("../utils/roc-logger");
const config = require("../utils/config");
const colors = require("colors");
const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    // once: true,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            logger(
                "Bot",
                "Command",
                "Info",
                `Running ${colors.yellow(
                    interaction.commandName
                )} for ${colors.yellow(interaction.user.username)} | ${colors.yellow(interaction.guild.name)}`
            );
            await command.execute(interaction);
            logger(
                "Bot",
                "Command",
                "Info",
                `Ran ${colors.yellow(
                    interaction.commandName
                )} for ${colors.yellow(interaction.user.username)} | ${colors.yellow(interaction.guild.name)}`
            );
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
};
