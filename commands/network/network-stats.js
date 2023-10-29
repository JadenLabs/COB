const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Sequelize = require("sequelize");
const NetworkSettings = require("../../models/networkSettings");
const Partnerships = require("../../models/partnerships");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("network-stats")
        .setDescription("Check this server's network stats"),
    async execute(interaction) {
        // NetworkSettings Database
        const networkSettings = await NetworkSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        // Check if disabled
        if (networkSettings === "0") {
            return interaction.reply({
                content:
                    "This server's networking module has not been enabled; if you're an admin, use /settings to enable it.",
                ephemeral: true,
            });
        }

        // Partnerships
        const partnerships = await Partnerships.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { guild1: interaction.guild.id },
                    { guild2: interaction.guild.id },
                ],
            },
        });

        const numberOfPartnerships = partnerships.length;

        // Embed
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Networking Stats")
            .setDescription(`This server's networking stats\n\
            \n\
            **Stats**\n\
            > Number of Partnerships:\n\
            > ${lang.E.reply} ${numberOfPartnerships}`)
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        await interaction.reply({ embeds: [embed] });
    },
};
