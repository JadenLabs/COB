const { logger } = require("../utils/roc-logger");
const config = require("../utils/config");
const lang = require("../utils/lang");
const { Events, EmbedBuilder } = require("discord.js");
const WelcomeSettings = require("../models/welcomeSettings");

module.exports = {
    name: Events.GuildMemberAdd,
    // once: true,
    async execute(member, client) {
        // Database
        const welcomeSettings = await WelcomeSettings.findOne({
            where: { guildId: member.guild.id },
        });

        if (welcomeSettings.enabled === "0") return;
        if (welcomeSettings.welcomeChannel === null) return;

        // Big embed start
        let icon = member.guild.iconURL();
        const serverName = member.guild.name;

        // * Big message start
        let embed = new EmbedBuilder()
            .setFooter({
                text: `Welcome ${member.user.tag}`,
                iconURL: `${member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            })
            .setTimestamp()
            .setColor(config.colors.primary)
            .setTitle(`Welcome to ${serverName}!`);

        if (icon) {
            embed.setAuthor({
                name: `${serverName}`,
                iconURL: `${icon}`,
            });
        }
        if (!icon) {
            embed.setAuthor({ name: `${serverName}` });
        }
        if (icon) {
            embed.setThumbnail(icon);
            embed.setFooter({
                text: `Requested by: ${member.user.tag}`,
                iconURL: `${member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });
        }
        const channel = await member.guild.channels.fetch(
            await welcomeSettings.welcomeChannel
        );
        await channel.send({ content: `<@${member.id}>`, embeds: [embed] });

        if (welcomeSettings.pingChannel) {
            let smallEmbed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`*<@${member.id}> has slid into the server*`);

            const content = welcomeSettings.welcomeRole
                ? `<@&${welcomeSettings.welcomeRole}>`
                : "";

            const pingChannel = await member.guild.channels.fetch(
                welcomeSettings.pingChannel
            );

            if (!pingChannel) return;

            await pingChannel.send({
                content: content,
                embeds: [smallEmbed],
            });
        }
    },
};
