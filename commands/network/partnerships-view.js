const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const {
    SlashCommandBuilder,
    EmbedBuilder,
    Permissions,
} = require("discord.js");
const Sequelize = require("sequelize");
const NetworkSettings = require("../../models/networkSettings");
const Partnerships = require("../../models/partnerships");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnerships-view")
        .setDescription("View this server's partnerships"),
    async execute(interaction) {
        // Get database information
        const networkSettings = await NetworkSettings.findOne({
            where: { guildId: interaction.guild.id },
        });

        // Partnerships
        const partnerships = await Partnerships.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { guild1: interaction.guild.id },
                    { guild2: interaction.guild.id },
                ],
            },
        });

        // If no partnerships, send a different embed
        if (partnerships.length === 0) {
            return interaction.reply({
                content: "This server does not have any partnerships.",
                ephemeral: true,
            });
        }

        // Map the partnerships to an array and collect non-interaction guild IDs
        const nonInteractionGuilds = [];

        const partnershipArray = partnerships.map((partnership) => {
            const { guild1, guild2 } = partnership;
            const nonInteractionGuildId =
                guild1 === interaction.guild.id ? guild2 : guild1;
            nonInteractionGuilds.push(nonInteractionGuildId);
            return partnership;
        });

        // Fetch the guild names
        const guildNames = [];
        for (const guildId of nonInteractionGuilds) {
            const guild = await interaction.client.guilds.cache.get(
                guildId,
                interaction.client
            );

            let guild1;
            let guild2;
            if (parseInt(interaction.guild.id) > parseInt(guildId)) {
                guild1 = interaction.guild.id;
                guild2 = guildId;
            } else {
                guild1 = guildId;
                guild2 = interaction.guild.id;
            }

            const partnership = await Partnerships.findOne({
                where: { guild1: guild1, guild2: guild2 },
            });
            const partnershipId = partnership.partnershipId;

            if (guild) {
                guildNames.push(
                    `\`${partnershipId}\`${lang.E.dot} ${guild.name}`
                );
            }
        }

        // Create a single string with guild names
        const guildNamesString = guildNames.join("\n");

        // Embed
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Server Partnerships")
            .setDescription(
                `This server's partnerships:\n>>> ${guildNamesString}`
            );

        // Respond
        await interaction.reply({ embeds: [embed] });
    },
};
