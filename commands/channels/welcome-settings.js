const config = require("../../utils/config");
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const WelcomeSettings = require("../../models/welcomeSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome-settings")
        .setDescription("View the server's welcome settings")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const [settings, created] = await WelcomeSettings.findOrCreate({
            where: { guildId: await interaction.guild.id },
        });

        const enabledStr = settings.enabled ? "True" : "False";

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("Server Welcome Settings")
            .setDescription(
                `**Enabled**:\n\
            > ${enabledStr}\n\
            **Channel**:\n\
            > <#${settings.welcomeChannel}>\n\
            > \`${settings.welcomeChannel}\`\n\
            **Role**:\n\
            > <@&${settings.welcomeRole}>\n\
            > \`${settings.welcomeRole}\``
            )
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        await interaction.reply({ embeds: [embed] });
    },
};
