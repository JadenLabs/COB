const config = require("../utils/config");
const { Events } = require("discord.js");
const WelcomeSettings = require("../models/welcomeSettings");

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // Database
        const welcomeSettings = await WelcomeSettings.findOne({
            where: { guildId: oldMember.guild.id },
        });

        if (!welcomeSettings) return;
        if (!welcomeSettings.joinRole) return;

        // When a member passes the guild join gate
        if (oldMember.pending && !newMember.pending) {
            await newMember.roles.add(welcomeSettings.joinRole);
        }
    },
};
