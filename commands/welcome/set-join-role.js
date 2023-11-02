const config = require("../../utils/config");
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const WelcomeSettings = require("../../models/welcomeSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-join-role")
        .setDescription("Sets the server's join role")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("The role to set as the join role")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const [settings, created] = await WelcomeSettings.findOrCreate({
            where: { guildId: interaction.guild.id },
        });

        const role = (await interaction.options.getRole("role")) ?? false;
        if (!role) {
            settings.update({ joinRole: null });

            return interaction.reply({
                content: "The welcome role has been disabled.",
                ephemeral: true,
            });
        }

        await settings.update({ joinRole: role.id, enabled: true });

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Role Set!")
            .setDescription(
                `Your join role has been set!\n\
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
