const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Moderation tools')
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('View recent moderation logs'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('View moderation statistics for the server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions')
                .setDescription('View your moderation actions')),
    async execute(interaction) {
        try {
            // Check if the user has the ModerateMembers permission
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            const subcommand = interaction.options.getSubcommand();
            const guild = interaction.guild;

            if (subcommand === 'logs') {
                const auditLogs = await guild.fetchAuditLogs({ limit: 10 });
                const logEntries = auditLogs.entries.map(entry => ({
                    action: String(entry.action), // Ensure this is a string
                    user: `<@${entry.executor.id}>`,
                    target: entry.target ? `<@${entry.target.id || entry.target}>` : 'N/A',
                    reason: entry.reason || 'No reason provided',
                    date: entry.createdAt.toLocaleDateString(),
                }));

                const embed = new EmbedBuilder()
                    .setTitle('Recent Moderation Logs')
                    .setColor(0xff5733)
                    .setDescription(
                        logEntries
                            .map(
                                log =>
                                    `**Action:** ${log.action}\n**Moderator:** ${log.user}\n**Target:** ${log.target}\n**Reason:** ${log.reason}\n**Date:** ${log.date}`
                            )
                            .join('\n\n') || 'No recent moderation logs available.'
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });

            } else if (subcommand === 'stats') {
                const auditLogs = await guild.fetchAuditLogs({ limit: 100 });
                const actionsCount = auditLogs.entries.reduce((stats, entry) => {
                    const actionName = String(entry.action); // Ensure this is a string
                    stats[actionName] = (stats[actionName] || 0) + 1;
                    return stats;
                }, {});

                const embed = new EmbedBuilder()
                    .setTitle('Moderation Statistics')
                    .setColor(0x33c6ff)
                    .setDescription(
                        Object.entries(actionsCount)
                            .map(([action, count]) => `**${action.replace(/_/g, ' ')}:** ${count}`)
                            .join('\n') || 'No moderation actions recorded.'
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });

            } else if (subcommand === 'actions') {
                const user = interaction.user;
                const auditLogs = await guild.fetchAuditLogs({ limit: 100 });
                const userActions = auditLogs.entries.filter(entry => entry.executor.id === user.id);

                const embed = new EmbedBuilder()
                    .setTitle(`${user.tag}'s Moderation Actions`)
                    .setColor(0xffc300)
                    .setDescription(
                        userActions
                            .map(
                                action =>
                                    `**Action:** ${String(action.action).replace(/_/g, ' ')}\n**Target:** ${
                                        action.target ? `<@${action.target.id || action.target}>` : 'N/A'
                                    }\n**Reason:** ${action.reason || 'No reason provided'}\n**Date:** ${action.createdAt.toLocaleDateString()}`
                            )
                            .join('\n\n') || 'You have not performed any moderation actions recently.'
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error('Error executing /mod:', error);
            await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    },
};
