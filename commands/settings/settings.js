const { logger } = require("../../utils/roc-logger");
const lang = require("../../utils/lang");
const config = require("../../utils/config");
const {
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const WelcomeSettings = require("../../models/welcomeSettings");
const NetworkSettings = require("../../models/networkSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Open the server's settings panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // Databases
        const [welcomeSettings, welcomeCreated] =
            await WelcomeSettings.findOrCreate({
                where: { guildId: interaction.guild.id },
            });
        const [networkSettings, networkCreated] =
            await NetworkSettings.findOrCreate({
                where: { guildId: interaction.guild.id },
            });

        // Strings
        const welcomeEnabled =
            welcomeSettings.enabled === "1" ? "Enabled" : "Disabled";
        const welcomeEnabledEmoji =
            welcomeSettings.enabled === "1"
                ? lang.E.greenTick
                : lang.E.redCross;
        const networkEnabled =
            networkSettings.enabled === true ? "Enabled" : "Disabled";
        const networkEnabledEmoji =
            networkSettings.enabled === true
                ? lang.E.greenTick
                : lang.E.redCross;

        // Make front page embed
        const frontEmbed = new EmbedBuilder()
            .setColor(config.colors.secondary)
            .setTitle(`📖 | Settings`)
            .setDescription(
                `Use the buttons below to navigate this server's bot settings.\n\n\
            **Status**\n\
            > Welcome Settings:\n\
            > ${lang.E.reply} ${welcomeEnabledEmoji} \`${welcomeEnabled}\`
            > Network Settings:\n\
            > ${lang.E.reply} ${networkEnabledEmoji} \`${networkEnabled}\``
            )
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        // Buttons
        const welcomeButton = new ButtonBuilder()
            .setCustomId("welcome_settings_button")
            .setLabel("Welcome Settings")
            .setStyle(ButtonStyle.Secondary);
        const networkButton = new ButtonBuilder()
            .setCustomId("network_settings_button")
            .setLabel("Network Settings")
            .setStyle(ButtonStyle.Secondary);

        // Action row
        const row = new ActionRowBuilder().addComponents(
            welcomeButton,
            networkButton
        );
        // Send embed
        await interaction.reply({
            embeds: [frontEmbed],
            components: [row],
            ephemeral: true,
        });
    },
};
