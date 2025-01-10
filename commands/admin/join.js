const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the voice channel or stage channel where the command was run'),
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

        if (!member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
            return;
        }

        // Check if the bot is in a guild and has the necessary permissions
        if (!interaction.guild) {
            await interaction.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true
            });
            return;
        }

        // Check if the bot has permission to connect and speak in the channel
        const botMember = interaction.guild.members.me;
        if (!botMember.permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) {
            await interaction.reply({
                content: 'I do not have permission to connect to this voice channel.',
                ephemeral: true
            });
            return;
        }
        if (!botMember.permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) {
            await interaction.reply({
                content: 'I do not have permission to speak in this voice channel.',
                ephemeral: true
            });
            return;
        }

        // Join the channel
        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                interaction.reply({
                    content: `Joined ${channel.name} successfully.`,
                    ephemeral: true
                });
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                interaction.reply({
                    content: `Disconnected from ${channel.name}.`,
                    ephemeral: true
                });
            });

        } catch (error) {
            console.error('Error joining voice channel:', error);
            await interaction.reply({
                content: 'An error occurred while trying to join the voice channel.',
                ephemeral: true
            });
        }
    },
};
