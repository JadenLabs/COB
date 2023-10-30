const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const {
    Permissions,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const NetworkSettings = require("../../models/networkSettings");
const Partnerships = require("../../models/partnerships");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnerships-end")
        .setDescription("End a partnership")
        .addStringOption((option) =>
            option
                .setName("partnership-id")
                .setDescription("The partnership's id")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        // Get database information
        const networkSettings = await NetworkSettings.findOne({
            where: { guildId: interaction.guild.id },
        });

        // Partnerships
        const inputId = interaction.options.getString("partnership-id");
        const partnership = await Partnerships.findOne({
            where: {
                partnershipId: inputId,
            },
        });
        if (!partnership) {
            return interaction.reply({
                content: "This partnership does not exist.",
                ephemeral: true,
            });
        } else if (
            partnership.guild1 !== interaction.guild.id &&
            partnership.guild2 !== interaction.guild.id
        ) {
            return interaction.reply({
                content: "That partnership does not belong to this server.",
                ephemeral: true,
            });
        }

        // Get guilds
        const guild1Settings = await NetworkSettings.findOne({
            where: { guildId: partnership.guild1 },
        });
        const guild2Settings = await NetworkSettings.findOne({
            where: { guildId: partnership.guild2 },
        });

        const guild1 = await interaction.client.guilds.fetch(
            partnership.guild1
        );
        const guild2 = await interaction.client.guilds.fetch(
            partnership.guild2
        );

        // Get notifs channels
        const guild1Nofifs = await guild1.channels.fetch(
            guild1Settings.notifsChannel
        );
        const guild2Nofifs = await guild2.channels.fetch(
            guild2Settings.notifsChannel
        );

        // Destroy partnership
        partnership.destroy();

        // Embed
        const embed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle("Partnership Ended")
            .setDescription(
                `A partnership has been ended:\n\
                > ${lang.E.dot} ${guild1.name}\n\
                > ${lang.E.dot} ${guild2.name}`
            );

        // Respond
        await interaction.reply({
            content: "Ending partnership.",
            ephemeral: true,
        });

        // Send messages
        await guild1Nofifs.send({ embeds: [embed] });
        await guild2Nofifs.send({ embeds: [embed] });
    },
};
