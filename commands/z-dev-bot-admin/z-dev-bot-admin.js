const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Admins = require("../../models/admins");
const Bans = require("../../models/bans");
const os = require("os");

const { startUsage, startTime } = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("z-dev-bot-admin")
        .setDescription("=== BOT ADMIN ===")
        .addStringOption((option) =>
            option.setName("action").setDescription("== DEV ==")
        )
        .addUserOption((option) =>
            option.setName("user").setDescription("== DEV ==")
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("== DEV ==")
        ),
    async execute(interaction) {
        // Database
        const admin = await Admins.findOne({
            where: { userId: interaction.user.id },
        });

        // Validate
        if (!admin) {
            const operatingSystem = os.platform();
            const architecture = os.arch();
            const cpuCores = os.cpus().length;
            const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const memoryUsage = process.memoryUsage();
            const memoryUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(
                2
            );

            const endUsage = process.cpuUsage();
            const allUsage = (
                (endUsage.user - startUsage.user) /
                1000000 /
                60
            ).toFixed(2);
            const uptimeSec = os.uptime().toFixed(2);
            const uptimeMin = (os.uptime() / 60).toFixed(2);
            const uptimeHr = (os.uptime() / 60 / 60).toFixed(2);

            const sorryEmbed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle("Sorry.")
                .setDescription(
                    `You are not an admin of this bot, but here's some information you may find interesting:
                
                **System Info**
                > Operating System
                > ${lang.E.reply} ${operatingSystem}
                > Architecture
                > ${lang.E.reply} ${architecture}
                > CPU Cores
                > ${lang.E.reply} ${cpuCores}
                > CPU time
                > ${lang.E.reply} ${allUsage} mins
                > Total Memory
                > ${lang.E.reply} ${totalMemory} GBs
                > Memory Usage
                > ${lang.E.reply} ${memoryUsedMB} MBs
                
                **Server Uptime**
                > ${lang.E.dot} ${uptimeSec} sec
                > ${lang.E.dot} ${uptimeMin} mins
                > ${lang.E.dot} ${uptimeHr} hrs
                `
                )
                .setFooter({
                    text: `Requested by: ${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                    })}`,
                });

            return interaction.reply({
                embeds: [sorryEmbed],
            });
        } else if (admin.scope < 1) {
            return interaction.reply({
                content:
                    "You do not have the needed permissions for this command.",
                ephemeral: true,
            });
        }

        // Input
        const action = (await interaction.options.getString("action")) ?? null;
        const user = (await interaction.options.getUser("user")) ?? null;
        const reason = (await interaction.options.getString("reason")) ?? null;

        if (action === "servers" && admin.scope > 0) {
            const guildsList = await Promise.all(
                interaction.client.guilds.cache.map(async (guild) => {
                    const owner = await guild.fetchOwner();

                    return `${guild.name} \`${guild.memberCount}\`\n\
                    > ${lang.E.dot} Id: ${guild.id}\n\
                    > ${lang.E.dot} Owner: ${owner.user.tag}`;
                })
            );

            const guildsEmbed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle("Servers List")
                .setDescription(`${guildsList.join("\n\n")}`)
                .setFooter({
                    text: `Requested by: ${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                    })}`,
                });

            return interaction.reply({
                embeds: [guildsEmbed],
                ephemeral: true,
            });
        } else if (action === "ban" && admin.scope > 1) {

        } else {
            const operatingSystem = os.platform();
            const architecture = os.arch();
            const cpuCores = os.cpus().length;
            const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const memoryUsage = process.memoryUsage();
            const memoryUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(
                2
            );

            const endUsage = process.cpuUsage();
            const allUsage = (
                (endUsage.user - startUsage.user) /
                1000000 /
                60
            ).toFixed(2);
            const uptimeSec = os.uptime().toFixed(2);
            const uptimeMin = (os.uptime() / 60).toFixed(2);
            const uptimeHr = (os.uptime() / 60 / 60).toFixed(2);

            const sorryEmbed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle("Bot Specs")
                .setDescription(
                    `**System Info**
                > Operating System
                > ${lang.E.reply} ${operatingSystem}
                > Architecture
                > ${lang.E.reply} ${architecture}
                > CPU Cores
                > ${lang.E.reply} ${cpuCores}
                > CPU time
                > ${lang.E.reply} ${allUsage} mins
                > Total Memory
                > ${lang.E.reply} ${totalMemory} GBs
                > Memory Usage
                > ${lang.E.reply} ${memoryUsedMB} MBs
                
                **Server Uptime**
                > ${lang.E.dot} ${uptimeSec} sec
                > ${lang.E.dot} ${uptimeMin} mins
                > ${lang.E.dot} ${uptimeHr} hrs
                `
                )
                .setFooter({
                    text: `Requested by: ${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                    })}`,
                });

            return interaction.reply({
                embeds: [sorryEmbed],
            });
        }
    },
};
