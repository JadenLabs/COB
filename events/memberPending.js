const config = require("../utils/config");
const {
    Events,
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const WelcomeSettings = require("../models/welcomeSettings");
const InterviewSettings = require("../models/interviewSettings");

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // Database
        const welcomeSettings = await WelcomeSettings.findOne({
            where: { guildId: oldMember.guild.id },
        });
        const interviewSettings = await InterviewSettings.findOne({
            where: { guildId: newMember.guild.id },
        });

        if (!welcomeSettings) return;
        if (!welcomeSettings.joinRole) return;

        // When a member passes the guild join gate
        if (oldMember.pending && !newMember.pending) {
            await newMember.roles.add(welcomeSettings.joinRole);

            if (
                interviewSettings &&
                interviewSettings.managerRole &&
                interviewSettings.categoryId &&
                interviewSettings.enabled
            ) {
                const category = await newMember.guild.channels.fetch(
                    interviewSettings.categoryId
                );

                const prefix = interviewSettings.channelPrefix;

                const interviewChannel = await newMember.guild.channels.create({
                    name: `${prefix}${newMember.user.username}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: newMember.user.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interviewSettings.managerRole,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: newMember.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                });

                const interviewEmbed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle("Interview")
                    .setDescription(
                        `Welcome <@${newMember.user.id}>, \
                        the managers of this interview will be here shortly.`
                    );

                await interviewChannel.send({
                    content: `<@${newMember.user.id}> <@&${interviewSettings.managerRole}>`,
                    embeds: [interviewEmbed],
                });
            }
        }
    },
};
