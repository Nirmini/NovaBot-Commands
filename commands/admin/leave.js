const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');
const { VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');

const EXEMPT_USER_ID = '600464355917692952'; // The exempted user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Make the bot leave the voice channel or stage channel where the command was run'),
    async execute(interaction) {
        // Get the channel where the command was run
        const channel = interaction.channel;

        // Check if the command was run in a voice channel or stage channel
        if (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice) {
            await interaction.reply({
                content: 'This command can only be used in a voice channel or stage channel.',
                ephemeral: true
            });
            return;
        }

        // Check if the user is either the exempt user or has the move members permission
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (interaction.user.id !== EXEMPT_USER_ID || !member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
            return;
        }

        // Check if the bot is in a voice channel and has the necessary permissions
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            await interaction.reply({
                content: 'The bot is not connected to a voice channel.',
                ephemeral: true
            });
            return;
        }

        try {
            // Disconnect from the voice channel
            connection.destroy();

            await interaction.reply({
                content: `Left ${channel.name} successfully.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error leaving voice channel:', error);
            await interaction.reply({
                content: 'An error occurred while trying to leave the voice channel.',
                ephemeral: true
            });
        }
    },
};
