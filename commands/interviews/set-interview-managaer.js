const { logger } = require("../../utils/roc-logger");
const config = require("../../utils/config");
const lang = require("../../utils/lang");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const InterviewSettigns = require("../../models/interviewSettings");
const Interviews = require("../../models/interviews");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-interview-manager")
        .setDescription("Sets the manager role for interview channels")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription(
                    "The role to set as manager"
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

        const role = await interaction.options.getRole("role");

        await interviewSettings.update({ managerRole: role.id });

        await interaction.reply({
            content: `I have set your manager role to ${role}!`,
            ephemeral: true,
        });
    },
};
