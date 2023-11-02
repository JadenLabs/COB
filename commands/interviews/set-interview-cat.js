const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");
const InterviewSettigns = require("../../models/interviewSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-interview-cat")
        .setDescription("Sets the interview category!")
        .addChannelOption((option) =>
            option
                .setName("category")
                .setDescription(
                    "The category for interview channels to be created in."
                )
                .addChannelTypes(ChannelType.GuildCategory)
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

        const category = await interaction.options.getChannel("category");

        await interviewSettings.update({ categoryId: category.id });

        await interaction.reply({
            content: `I have set your interview category to \`${category.name}\`!`,
            ephemeral: true,
        });
    },
};
