const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const {
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} = require("discord.js");
const NetworkSettings = require("../../models/networkSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-partnership-channel")
        .setDescription("Sets this server's partners channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription(
                    "The channel to set for the partnership messages."
                )
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        // NetworkSettings Database
        const [networkSettings, created] = await NetworkSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        // Check if disabled
        if (networkSettings.enabled === false) {
            return interaction.reply({
                content:
                    "This server's networking module has not been enabled - use /settings to enable it.",
                ephemeral: true,
            });
        }

        // Get channel from option
        const channel = await interaction.options.getChannel("channel");

        // Update DB
        await networkSettings.update({ partnersChannel: channel.id });

        // Embed
        const embed = new EmbedBuilder()
            .setColor(config.colors.secondary)
            .setTitle("Channel Set")
            .setDescription(`Your partners channel has been set!\n> ${channel}`)
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        // Respond
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
