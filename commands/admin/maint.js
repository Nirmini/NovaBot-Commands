const { SlashCommandBuilder, ActivityType } = require('discord.js');
const axios = require('axios');

const allowedUserId = '600464355917692952'; // Replace with your user ID
const statusPageApiKey = '0e94c87553074d66a1491d91bdb691f7'; // Replace with your API key
const pageId = '266y9bdyj6sf'; // Replace with your page ID
const itemId = 'wjcm5tc61y85'; // Replace with your component ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maint')
        .setDescription('Remote Maintenance Mode [MultiTeam]'),
    async execute(interaction) {
        if (interaction.user.id !== allowedUserId) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        try {
            await interaction.reply('Working...');

            // Set bot presence
            interaction.client.user.setPresence({
                activities: [{
                    name: 'Maintenance',
                    type: ActivityType.Watching
                }],
                status: 'dnd'
            });

            // Update Statuspage component to 'under_maintenance'
            await axios({
                method: 'patch',
                url: `https://api.statuspage.io/v1/pages/${pageId}/components/${itemId}`,
                headers: {
                    'Authorization': `OAuth ${statusPageApiKey}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    component: {
                        status: 'under_maintenance'
                    }
                }
            });

            setTimeout(async () => {
                await interaction.followUp('Bot is now in maintenance mode & Statuspage updated.');
                
                // Kill all shards
                const shardManager = interaction.client.shard;
                if (shardManager && shardManager.shards.size > 0) {
                    await interaction.followUp(`Killing all ${shardManager.shards.size} shards...`);
                    for (const shard of shardManager.shards.values()) {
                        try {
                            await shard.kill();
                            console.log(`Shard ${shard.id} killed.`);
                        } catch (err) {
                            console.error(`Error killing shard ${shard.id}:`, err);
                        }
                    }
                }

                // Kill the main bot process after shard termination
                setTimeout(() => {
                    interaction.followUp({ content: 'Killing main bot process.', ephemeral: true });
                    process.exit(0);
                }, 2000);

            }, 2000);

        } catch (error) {
            console.error('Error setting maintenance mode:', error);
            await interaction.followUp({ content: 'There was an error. Please try again later.', ephemeral: true });
        }
    },
};
