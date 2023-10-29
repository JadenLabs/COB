const { logger } = require("../utils/roc-logger");
const config = require("../utils/config");
const lang = require("../utils/lang");
const { Events, EmbedBuilder } = require("discord.js");
const NetworkSettings = require("../models/networkSettings");
const ReplyListener = require("../models/replyListener");

module.exports = {
    name: Events.MessageCreate,
    // once: true,
    async execute(message) {
        // Validate
        if (message.author.bot) return;

        // Reply listener
        if (message.reference) {
            if (message.reference.author === config.botId) return;

            // Network settings
            const networkSettings = await NetworkSettings.findOne({
                where: { guildId: message.guildId },
            });
            if (!networkSettings) return;
            if (networkSettings.enabled === false) return;

            // Databases
            const listener = await ReplyListener.findOne({
                where: { messageId: message.reference.messageId },
            });

            // Validate
            if (!listener) return;
            if (message.author.id !== listener.userId) return;

            // Get message content
            const userResponse = message.content;

            // Embed
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle("Set Ad")
                .setDescription(
                    `I have set your server's ad!\n>>> \`\`\`${userResponse}\`\`\``
                )
                .setFooter({
                    text: `Requested by: ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 1024,
                    })}`,
                });

            // Respond
            await message.reply({
                embeds: [embed],
            });

            // Destroy listener
            await listener.destroy();

            // Update ad
            await networkSettings.update({ serverAd: userResponse });
        }
    },
};
