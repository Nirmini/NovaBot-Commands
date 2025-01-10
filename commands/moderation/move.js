const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a user to a specified voice channel.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to move.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('targetvc')
                .setDescription('The target voice channel.')
                .setRequired(true)
                .addChannelTypes(2)) // Restrict to voice channels
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers), // Restrict to users with "Move Members" permission
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const targetVC = interaction.options.getChannel('targetvc');
        const member = interaction.guild.members.cache.get(targetUser.id);

        // Ensure the user is in a voice channel
        if (!member.voice.channel) {
            return interaction.reply({
                content: `${targetUser.tag} is not in a voice channel.`,
                ephemeral: true,
            });
        }

        // Check if the user is already in the target VC
        if (member.voice.channel.id === targetVC.id) {
            return interaction.reply({
                content: `${targetUser.tag} is already in the specified voice channel.`,
                ephemeral: true,
            });
        }

        try {
            // Move the user
            await member.voice.setChannel(targetVC);
            await interaction.reply({
                content: `✅ Successfully moved ${targetUser.tag} to **${targetVC.name}**.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(`Error moving ${targetUser.tag}:`, error);
            await interaction.reply({
                content: `❌ Failed to move ${targetUser.tag}.`,
                ephemeral: true,
            });
        }
    },
};
