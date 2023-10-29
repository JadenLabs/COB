const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const OutgoingRequests = require("../../models/outgoingRequests");
const NetworkSettings = require("../../models/networkSettings");
const Partnerships = require("../../models/partnerships");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnership-request")
        .setDescription("Check this server's network stats")
        .addStringOption((option) =>
            option
                .setName("guild-id")
                .setDescription("The guild to send a partnership request to")
                .setRequired(true)
        ),
    async execute(interaction) {
        // NetworkSettings Database
        const [networkSettings, created] = await NetworkSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        // Check if disabled
        if (networkSettings.enabled === false) {
            return interaction.reply({
                content:
                    "This server's networking module has not been enabled; if you're an admin, use /settings to enable it.",
                ephemeral: true,
            });
        }

        // Set interaction vars
        const homeGuildId = interaction.guild.id;
        const homeGuild = interaction.guild;
        const awayGuildId = await interaction.options.getString("guild-id");

        // Check if id is the interaction guild
        if (homeGuildId === awayGuildId) {
            return interaction.reply({
                content:
                    "You cannot send a partnership request to this server.",
                ephemeral: true,
            });
        }

        /// Set scope
        let awayGuild;
        try {
            // Get guild from option
            awayGuild = await interaction.client.guilds.fetch(awayGuildId);
        } catch (e) {
            return interaction.reply({
                content:
                    "Sorry, either that server does not exist, or this bot has not been added to that server.",
                ephemeral: true,
            });
        }

        // Get network settings for away guild
        const awayNetworkSettings = await NetworkSettings.findOne({
            where: { guildId: awayGuildId },
        });

        // Validate away guild settings
        if (!awayNetworkSettings) {
            return interaction.reply({
                content:
                    "That server does not have their network settings set up.",
                ephemeral: true,
            });
        } else if (!awayNetworkSettings.enabled) {
            return interaction.reply({
                content:
                    "That server does not have their network settings enabled.",
                ephemeral: true,
            });
        } else if (!awayNetworkSettings.notifsChannel) {
            return interaction.reply({
                content: "That server does not have a notifs channel set up.",
                ephemeral: true,
            });
        }

        // set away notif channel id
        const awayChannelId = awayNetworkSettings.notifsChannel;

        // Set scope
        let awayChannel;
        try {
            // Get away guild notifs channel
            awayChannel = await interaction.client.channels.fetch(
                awayChannelId
            );
        } catch (e) {
            return interaction.reply({
                content: "That server's notifs channel does not exist.",
                ephemeral: true,
            });
        }

        // Create outgoing request record
        // Sort id
        let guild1;
        let guild2;
        if (parseInt(homeGuildId) > parseInt(awayGuildId)) {
            guild1 = homeGuildId;
            guild2 = awayGuildId;
        } else {
            guild1 = awayGuildId;
            guild2 = homeGuildId;
        }

        const request = await OutgoingRequests.create({
            guild1: guild1,
            guild2: guild2,
        });

        // Send request message in away channel
        // Set up embed
        const reqEmbed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Partnership Request")
            .setDescription(
                `${homeGuild.name} is wishing to partner with you! Do you accept?\n> Request ID: \`${request.requestID}\``
            )
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        // Send message
        const awayMessage = await awayChannel.send({
            embeds: [reqEmbed],
        });

        // Embed
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Partnership Request")
            .setDescription(`Partnership request sent to ${awayGuild.name}`)
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        // Respond
        await interaction.reply({ embeds: [embed] });
    },
};
