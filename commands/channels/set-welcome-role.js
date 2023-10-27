const config = require("../../utils/config");
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const WelcomeSettings = require("../../models/welcomeSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-welcome-role")
        .setDescription("Sets the server's welcome role")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("The role to set as the welcome role")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const role = await interaction.options.getRole("role");

        const [settings, created] = await WelcomeSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        await settings.update({ welcomeRole: role.id, enabled: true });

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Role Set!")
            .setDescription(
                `Your welcome role has been set!\n\
            > ${role}`
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
