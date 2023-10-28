const config = require("../../utils/config");
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");
const WelcomeSettings = require("../../models/welcomeSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-ping-channel")
        .setDescription("Sets the server's welcome ping channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription(
                    "The channel to set as the welcome ping channel"
                )
                .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const [settings, created] = await WelcomeSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        const channel = await interaction.options.getChannel("channel");
        if (!channel) {
            await settings.update({ pingChannel: null });

            return interaction.reply({
                content: "The welcome ping has been disabled.",
                ephemeral: true,
            });
        }

        await settings.update({ pingChannel: channel.id, enabled: true });

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Welcome Ping Set!")
            .setDescription(
                `Your welcome ping channel has been set!\n\
            > ${channel}`
            )
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
