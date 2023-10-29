const config = require("../../utils/config");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        const latency = Date.now() -interaction.createdTimestamp;

        const pingEmbed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setDescription(
                `### Pong! 🏓\n\
				> Client latency: ${latency}ms`
            )
            .setFooter({
                text: `Requested by: ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                })}`,
            });

        await interaction.reply({ embeds: [pingEmbed], ephemeral: true });
    },
};
