const { logger } = require("../utils/roc-logger");
const lang = require("../utils/lang");
const config = require("../utils/config");
const {
    Events,
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
} = require("discord.js");
const WelcomeSettings = require("../models/welcomeSettings");

module.exports = {
    name: Events.InteractionCreate,
    // once: true,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === "welcome_settings_button") {
            // Databases
            const [welcomeSettings, created] =
                await WelcomeSettings.findOrCreate({
                    where: { guildId: interaction.guild.id },
                });

            // Strings
            const welcomeEnabled =
                welcomeSettings.enabled === "1" ? "Enabled" : "Disabled";
            const welcomeEnabledEmoji =
                welcomeSettings.enabled === "1"
                    ? lang.E.greenTick
                    : lang.E.redCross;

            // Embed
            const welcomePage = new EmbedBuilder()
                .setColor(config.colors.secondary)
                .setTitle(`☕ | Welcome Settings`)
                .setDescription(
                    `Use the buttons below to enable or disable this module.\n\n\
            **Status**\n\
            > Enabled:\n\
            > ${lang.E.reply} ${welcomeEnabledEmoji} \`${welcomeEnabled}\`\n\
            > Channel:\n\
            > ${lang.E.reply} <#${welcomeSettings.welcomeChannel}>\n\
            > Role:\n\
            > ${lang.E.reply} <@&${welcomeSettings.welcomeRole}>`
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
            let enable = new ButtonBuilder()
                .setCustomId("enable_welcome_button")
                .setLabel("Enable")
                .setStyle(ButtonStyle.Success);

            let disable = new ButtonBuilder()
                .setCustomId("disable_welcome_button")
                .setLabel("Disable")
                .setStyle(ButtonStyle.Danger);

            if (welcomeSettings.enabled === "1") {
                enable.setDisabled(true);
                disable.setDisabled(false);
            } else {
                enable.setDisabled(false);
                disable.setDisabled(true);
            }

            // Action row
            const row = new ActionRowBuilder().addComponents(enable, disable);

            return interaction.reply({
                embeds: [welcomePage],
                components: [row],
                ephemeral: true,
            });
        } else if (interaction.customId === "enable_welcome_button") {
            // Get DB
            const [welcomeSettings, created] =
                await WelcomeSettings.findOrCreate({
                    where: { guildId: interaction.guild.id },
                });

            if (welcomeSettings.enabled === "1") {
                return interaction.reply({
                    content: `This module has already been enabled!`,
                    ephemeral: true,
                });
            } else {
                await welcomeSettings.update({ enabled: true });

                return interaction.reply({
                    content: `${lang.E.greenTick} The welcome module has been enabled!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.customId === "disable_welcome_button") {
            // Get DB
            const [welcomeSettings, created] =
                await WelcomeSettings.findOrCreate({
                    where: { guildId: interaction.guild.id },
                });

            if (welcomeSettings.enabled === "1") {
                await welcomeSettings.update({ enabled: false });

                return interaction.reply({
                    content: `${lang.E.redCross} The welcome module has been disabled!`,
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: `This module has already been disabled!`,
                    ephemeral: true,
                });
            }
        }
    },
};
