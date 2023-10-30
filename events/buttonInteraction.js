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
const NetworkSettings = require("../models/networkSettings");

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
            const pingChannel = welcomeSettings.pingChannel
                ? `<#${welcomeSettings.pingChannel}>`
                : "None";
            const welcomeRole = welcomeSettings.welcomeRole
                ? `<@&${welcomeSettings.welcomeRole}>`
                : "None";

            // Embed
            const welcomePage = new EmbedBuilder()
                .setColor(config.colors.secondary)
                .setTitle(`☕ | Welcome Settings`)
                .setDescription(
                    `Use the buttons below to enable or disable this module.\n\n\
            **Commands**\n\
            > Welcome Channel:\n\
            > ${lang.E.reply} </set-welcome-channel:1167548439324803286>\n\
            > Ping Channel:\n\
            > ${lang.E.reply} </set-ping-channel:1167943532271644734>\n\
            > Welcome Role:\n\
            > ${lang.E.reply} </set-welcome-role:1167548439324803287>\n\

            **Status**\n\
            > Enabled:\n\
            > ${lang.E.reply} ${welcomeEnabledEmoji} \`${welcomeEnabled}\`\n\
            > Welcome Channel:\n\
            > ${lang.E.reply} <#${welcomeSettings.welcomeChannel}>\n\
            > Ping Channel:\n\
            > ${lang.E.reply} ${pingChannel}
            > Welcome Role:\n\
            > ${lang.E.reply} ${welcomeRole}`
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

            // Response
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
        } else if (interaction.customId === "network_settings_button") {
            const [networkSettings, networkCreated] =
                await NetworkSettings.findOrCreate({
                    where: { guildId: interaction.guild.id },
                });

            // Strings
            const networkEnabled =
                networkSettings.enabled === true ? "Enabled" : "Disabled";
            const networkEnabledEmoji =
                networkSettings.enabled === true
                    ? lang.E.greenTick
                    : lang.E.redCross;
            const notifsChannel = networkSettings.notifsChannel
                ? `<#${networkSettings.notifsChannel}>`
                : "None";
            const partnersChannel = networkSettings.partnersChannel
                ? `<#${networkSettings.partnersChannel}>`
                : "None";
            const adSet = networkSettings.serverAd ? "Set" : "None";

            // Embed
            const welcomePage = new EmbedBuilder()
                .setColor(config.colors.secondary)
                .setTitle(`💻 | Network Settings`)
                .setDescription(
                    `Use the buttons below to enable or disable this module.\n\
        **Commands**\n\
        > Notifs Channel:\n\
        > ${lang.E.reply} </set-partnership-notifs:1168055489100267631>\n\
        > Partners Channel:\n\
        > ${lang.E.reply} </set-partnership-channel:1168419146824949800>\n\
        > Server Ad:\n\
        > ${lang.E.reply} </partnership-ad:1168297132076322896>\n\

        **Status**\n\
        > Enabled:\n\
        > ${lang.E.reply} ${networkEnabledEmoji} \`${networkEnabled}\`\n\
        > Notifs Channel:\n\
        > ${lang.E.reply} ${notifsChannel}\n\
        > Partners Channel:\n\
        > ${lang.E.reply} ${partnersChannel}\n\
        > Server Ad:\n\
        > ${lang.E.reply} \`${adSet}\``
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
                .setCustomId("enable_network_button")
                .setLabel("Enable")
                .setStyle(ButtonStyle.Success);

            let disable = new ButtonBuilder()
                .setCustomId("disable_network_button")
                .setLabel("Disable")
                .setStyle(ButtonStyle.Danger);

            if (networkSettings.enabled === true) {
                enable.setDisabled(true);
                disable.setDisabled(false);
            } else {
                enable.setDisabled(false);
                disable.setDisabled(true);
            }

            // Action row
            const row = new ActionRowBuilder().addComponents(enable, disable);

            // Response
            return interaction.reply({
                embeds: [welcomePage],
                components: [row],
                ephemeral: true,
            });
        } else if (interaction.customId === "enable_network_button") {
            // Get DB
            const [networkSettings, networkCreated] =
                await NetworkSettings.findOrCreate({
                    where: { guildId: interaction.guild.id },
                });

            if (networkSettings.enabled === true) {
                return interaction.reply({
                    content: `This module has already been enabled!`,
                    ephemeral: true,
                });
            } else {
                await networkSettings.update({ enabled: true });

                return interaction.reply({
                    content: `${lang.E.greenTick} The network module has been enabled!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.customId === "disable_network_button") {
            // Get DB
            const [networkSettings, networkCreated] =
                await NetworkSettings.findOrCreate({
                    where: { guildId: interaction.guild.id },
                });

            if (networkSettings.enabled === true) {
                await networkSettings.update({ enabled: false });

                return interaction.reply({
                    content: `${lang.E.redCross} The network module has been disabled!`,
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: `This module has already been disabled!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.customId === "view_ad_button") {
            // Get DB
            const networkSettings = await NetworkSettings.findOne({
                where: { guildId: interaction.guild.id },
            });

            // Validate
            if (!networkSettings) {
                return interaction.reply({
                    content: `This server's settings could not be found.`,
                    ephemeral: true,
                });
            }

            // Embed
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`${interaction.guild.name} Ad`)
                .setDescription(networkSettings.serverAd)
                .setThumbnail(await interaction.guild.iconURL())
                .setFooter({
                    text: `Requested by: ${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                    })}`,
                });

            // Respond
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
