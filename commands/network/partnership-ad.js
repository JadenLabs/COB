const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const {
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const NetworkSettings = require("../../models/networkSettings");
const ReplyListener = require("../../models/replyListener");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnership-ad")
        .setDescription("Set or view this server's ad")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        // Get settings
        const [networkSettings, networkCreated] =
            await NetworkSettings.findOrCreate({
                where: { guildId: interaction.guild.id },
            });

        // Strings
        const adSet = networkSettings.serverAd ? "Set" : "None";
        const viewLine = networkSettings.serverAd
            ? "Use the button below to view the server's ad\n"
            : "";

        // Embed
        const embed = new EmbedBuilder()
            .setColor(config.colors.secondary)
            .setTitle("Server Ad")
            .setDescription(
                `${viewLine}**Reply** to this message with your server's ad to set it.`
            )
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        // Make buttons
        const serverAd = new ButtonBuilder()
            .setCustomId("view_ad_button")
            .setLabel("View Ad")
            .setEmoji("📜")
            .setStyle(ButtonStyle.Secondary);

        // Make action row
        const row = new ActionRowBuilder().addComponents(serverAd);

        let components = [];
        if (networkSettings.serverAd) {
            components = [row];
        }

        const response = await interaction.reply({
            embeds: [embed],
            components: components,
        });
        const responseMessage = await response.fetch();

        // Create listener
        const listener = await ReplyListener.create({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            messageId: responseMessage.id,
        });
    },
};
