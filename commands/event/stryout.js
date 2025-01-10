const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

const botEmojiId = '1319480831303225354';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stryout')
        .setDescription('Start an tryout')
        .addStringOption(option =>
            option.setName('place')
                .setDescription('Location of the tryout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('pingrole')
                .setDescription('Role to ping')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('sendchannel')
                .setDescription('Channel to announce in')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const guildId = interaction.guildId;
            const user = interaction.user;
            const placeURL = interaction.options.getString('place');
            const pingRole = interaction.options.getString('pingrole');
            const channel = interaction.options.getChannel('sendchannel'); // Resolves the channel object

            // Check if the user has the required permissions
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.CreateEvents)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            // Check if the resolved channel is valid
            if (!channel || !channel.isTextBased()) {
                await interaction.reply({ content: 'The specified channel is not a valid text channel.', ephemeral: true });
                return;
            }

            const tryoutEmbed = new EmbedBuilder()
                .setColor(0x264a78)
                .setTitle('tryout Notice.')
                .setDescription(`An tryout has been started by ${user.tag}.`)
                .addFields(
                    { name: 'Location: ', value: placeURL },
                    { name: '\u200B', value: 'When you join follow all given instructions. You will be unable to join after \`5min\`.' },
                    { name: 'Additional Info:', value: 'We reserve the right to blacklist you as we see fit.' },
                )
                .setTimestamp();

            // Send the ping role and embed
            await channel.send(pingRole); // Sends the role mention
            const embedMessage = await channel.send({ embeds: [tryoutEmbed] });

            // Confirm successful scheduling to the user
            await interaction.reply({ content: 'tryout has been scheduled.', ephemeral: true });
        } catch (error) {
            // Log the error for debugging
            console.error('Error during /stryout command execution:', error);

            // Reply with a friendly error message
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error scheduling the tryout. Please try again later.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'An unexpected error occurred.', ephemeral: true });
            }
        }
    },
};
