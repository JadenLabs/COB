const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const OutgoingRequests = require("../../models/outgoingRequests");
const NetworkSettings = require("../../models/networkSettings");
const Partnerships = require("../../models/partnerships");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnership-accept")
        .setDescription("Accept a partnership request")
        .addStringOption((option) =>
            option
                .setName("request-id")
                .setDescription("The request's id")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        // NetworkSettings Database
        const [networkSettings, created] = await NetworkSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        // Validate
        if (networkSettings.enabled === false) {
            return interaction.reply({
                content:
                    "This server's networking module has not been enabled; if you're an admin, use /settings to enable it.",
                ephemeral: true,
            });
        } else if (!networkSettings.serverAd) {
            return interaction.reply({
                content: "This server does not have an ad set up.",
                ephemeral: true,
            });
        }

        // Get request
        const requestID = await interaction.options.getString("request-id");
        const request = await OutgoingRequests.findOne({
            where: { requestID: requestID },
        });

        // Validate request
        if (!request) {
            return interaction.reply({
                content: "This request's id is invalid.",
                ephemeral: true,
            });
        }

        // Get guilds
        const guild1Id = request.guild1;
        const guild2Id = request.guild2;

        // Validate
        if (!guild1Id) {
            return interaction.reply({
                content: "ERROR: This request did not have a guild 1 ID.",
                ephemeral: true,
            });
        } else if (!guild2Id) {
            return interaction.reply({
                content: "ERROR: This request did not have a guild 2 ID.",
                ephemeral: true,
            });
        }

        const guild1 = await interaction.client.guilds.fetch(guild1Id);
        const guild2 = await interaction.client.guilds.fetch(guild2Id);

        // Validate
        if (!guild1) {
            return interaction.reply({
                content: "ERROR: Guild 1 does not exist.",
                ephemeral: true,
            });
        } else if (!guild2) {
            return interaction.reply({
                content: "ERROR: Guild 2 does not exist.",
                ephemeral: true,
            });
        }

        // Get network settings
        const guild1Settings = await NetworkSettings.findOne({
            where: { guildId: guild1Id },
        });
        const guild2Settings = await NetworkSettings.findOne({
            where: { guildId: guild2Id },
        });

        // Validate
        if (!guild1Settings) {
            return interaction.reply({
                content: "ERROR: Guild 1 settings do not exist.",
                ephemeral: true,
            });
        } else if (!guild2Settings) {
            return interaction.reply({
                content: "ERROR: Guild 2 settings do not exist.",
                ephemeral: true,
            });
        }

        // Get notif channels
        const guild1Notif = guild1Settings.notifsChannel;
        const guild2Notif = guild2Settings.notifsChannel;

        // Validate
        if (!guild1Notif) {
            return interaction.reply({
                content: "ERROR: Guild 1 does not have a set notifs channel.",
                ephemeral: true,
            });
        } else if (!guild2Notif) {
            return interaction.reply({
                content: "ERROR: Guild 2 does not have a set notifs channel.",
                ephemeral: true,
            });
        }

        const guild1Channel = await interaction.client.channels.fetch(
            guild1Notif
        );
        const guild2Channel = await interaction.client.channels.fetch(
            guild2Notif
        );

        // Get partner channels
        const guild1Partner = guild1Settings.partnersChannel;
        const guild2Partner = guild2Settings.partnersChannel;

        // Validate
        if (!guild1Partner) {
            return interaction.reply({
                content: "ERROR: Guild 1 does not have a set partners channel.",
                ephemeral: true,
            });
        } else if (!guild2Partner) {
            return interaction.reply({
                content: "ERROR: Guild 2 does not have a set partners channel.",
                ephemeral: true,
            });
        }

        const guild1PartnerChannel = await interaction.client.channels.fetch(
            guild1Partner
        );
        const guild2PartnerChannel = await interaction.client.channels.fetch(
            guild2Partner
        );

        // Validate
        if (!guild1PartnerChannel) {
            return interaction.reply({
                content: "ERROR: Guild 1's partners channel does not exist.",
                ephemeral: true,
            });
        } else if (!guild2PartnerChannel) {
            return interaction.reply({
                content: "ERROR: Guild 2's partners channel does not exist.",
                ephemeral: true,
            });
        }

        // Destroy request record
        await request.destroy();

        // Create partnership record
        const partnership = await Partnerships.create({
            guild1: guild1Id,
            guild2: guild2Id,
        });

        // Send responses
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle("Partnership Accepted")
            .setDescription(
                `A partnership has been established!\n> ${guild1.name}\n> ${guild2}\n\nPartnership ID: ${partnership.partnershipId}`
            );
        const guild1Ad = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`${guild1.name} Ad`)
            .setDescription(`${guild1Settings.serverAd}`)
            .setThumbnail(await guild1.iconURL());
        const guild2Ad = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`${guild1.name} Ad`)
            .setDescription(`${guild2Settings.serverAd}`)
            .setThumbnail(await guild2.iconURL());

        await guild1Channel.send({ embeds: [embed] });
        await guild2Channel.send({ embeds: [embed] });

        await guild1PartnerChannel.send({ embeds: [guild2Ad] });
        await guild2PartnerChannel.send({ embeds: [guild1Ad] });
    },
};
