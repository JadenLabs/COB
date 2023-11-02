const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const InterviewSettigns = require("../../models/interviewSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-interview-prefix")
        .setDescription("Sets the interview channel prefix!")
        .addStringOption((option) =>
            option
                .setName("prefix")
                .setDescription(
                    "The prefix to add to the interview channel names."
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const [interviewSettings, created] =
            await InterviewSettigns.findOrCreate({
                where: { guildId: interaction.guild.id },
            });

        if (!interviewSettings.enabled) {
            return interaction.reply({
                content:
                    "Your server does not have the interview module enabled - run /settings to fix this.",
                ephemeral: true,
            });
        }

        const prefix = await interaction.options.getString("prefix");

        await interviewSettings.update({ channelPrefix: prefix });

        await interaction.reply({
            content: `I have set your channel prefix to \`${prefix}\`!`,
            ephemeral: true,
        });
    },
};
