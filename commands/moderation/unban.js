const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('The User ID or username of the person to unban.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for unbanning the user.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Get the input values
            const userInput = interaction.options.getString('user');
            const reason = interaction.options.getString('reason');
            
            // Check if the executor has permission to ban members
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
                return;
            }

            // Check if the bot has permission to unban members
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await interaction.reply({ content: 'I do not have permission to unban members.', ephemeral: true });
                return;
            }

            // Attempt to fetch the user by ID
            const user = await interaction.client.users.fetch(userInput).catch(() => null);

            // If no valid user found, reply with an error
            if (!user) {
                await interaction.reply({ content: `Invalid User ID or username: "${userInput}". Please ensure it's correct.`, ephemeral: true });
                return;
            }

            // Unban the user
            await interaction.guild.bans.remove(user.id, `${reason}, Moderator: ${interaction.user.tag}`);

            // Send confirmation
            const embed = new EmbedBuilder()
                .setTitle('User Unbanned')
                .setColor(0x00ff00)
                .setTimestamp()
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error unbanning user:', error);
            if (error.message.includes('Unknown Ban')) {
                await interaction.reply({ content: 'This user is not currently banned.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'An error occurred while attempting to unban the user.', ephemeral: true });
            }
        }
    },
};
