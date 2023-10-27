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
        .setName("set-welcome-channel")
        .setDescription("Sets the server's welcome channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel to set as the welcome channel")
                .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const channel =
            (await interaction.options.getChannel("channel")) ??
            interaction.channel;

        const [settings, created] = await WelcomeSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        await settings.update({ welcomeChannel: channel.id, enabled: true });

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Channel Set!")
            .setDescription(
                `Your welcome channel has been set!\n\
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
