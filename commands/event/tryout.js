const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

const botEmojiId = '1319480831303225354';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tryout')
        .setDescription('Schedule a tryout')
        .addStringOption(option =>
            option.setName('datetime')
                .setDescription('Timestamp of the tryout')
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
            const dateTime = interaction.options.getString('datetime');
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
                .setTitle('Tryout Notice.')
                .setDescription(`A tryout has been scheduled by ${user.tag}.`)
                .addFields(
                    { name: 'Date and Time', value: dateTime },
                    { name: 'Dress Code:', value: 'The dress code is that all items and packages must be removed.' },
                    { name: 'Additional Info:', value: 'We reserve the right to blacklist you as we see fit.' },
                    { name: 'Attendance:', value: 'The location will be given when the tryout begins. To attend, react to this message.' }
                )
                .setTimestamp();

            // Send the ping role and embed
            await channel.send(pingRole); // Sends the role mention
            const embedMessage = await channel.send({ embeds: [tryoutEmbed] });

            // Add the custom emoji reaction
            const emojiReference = `<:Check:${botEmojiId}>`; // Replace 'custom' with your emoji name
            await embedMessage.react(botEmojiId); // React using the emoji ID

            // Confirm successful scheduling to the user
            await interaction.reply({ content: 'Tryout has been scheduled.', ephemeral: true });
        } catch (error) {
            // Log the error for debugging
            console.error('Error during /tryout command execution:', error);

            // Reply with a friendly error message
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error scheduling the tryout. Please try again later.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'An unexpected error occurred.', ephemeral: true });
            }
        }
    },
};
