const { SlashCommandBuilder, WebhookClient } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Send a report to the SHDT.'),
    async execute(interaction) {
        const webhookURL = 'https://ptb.discord.com/api/webhooks/1325220566747058227/RH7wgxlH9w_8v41BPxgpqlfhowSWBSCYw3R3B_No2kB29ap8h08JkYIi0x1LH5iNWEL2';
        const webhookClient = new WebhookClient({ url: webhookURL });

        const user = interaction.user;
        const guild = interaction.guild;

        // Format the report message
        const reportMessage = `\`${user.username} (@${user.id})\` reported \`${guild.name} (${guild.id})\` for AUP and/or Discord Terms violations.`;

        try {
            // Send the message to the webhook
            await webhookClient.send({ content: reportMessage });

            // Acknowledge the report
            await interaction.reply({ content: '✅ Your report has been submitted.', ephemeral: true });
        } catch (error) {
            console.error('Error sending report via webhook:', error);
            await interaction.reply({ content: '❌ Failed to submit your report. Please try again later.', ephemeral: true });
        }
    },
};
