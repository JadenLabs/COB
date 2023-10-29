const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
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

        const response = await interaction.reply({ embeds: [embed] });
        const responseMessage = await response.fetch();

        // Create listener
        const listener = await ReplyListener.create({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            messageId: responseMessage.id,
        });
    },
};
