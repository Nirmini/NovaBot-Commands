const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { env } = require('process');
require('dotenv').config();
const githubtoken = process.env.GTHBTOKEN

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Fetch information about a GitHub repository')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('The URL of the GitHub repository')
                .setRequired(true)),

    async execute(interaction) {
        const repoUrl = interaction.options.getString('url');

        // Extract owner and repo name from the URL
        const match = repoUrl.match(/github\.com\/(\w+)\/(\w+)/);
        if (!match) {
            await interaction.reply({ content: 'Invalid GitHub repository URL.', ephemeral: true });
            return;
        }

        const [_, owner, repo] = match;
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${githubtoken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                await interaction.reply({ content: 'Failed to fetch repository information. Please check the URL.', ephemeral: true });
                return;
            }

            const data = await response.json();

            // Create an embed with repository details
            const embed = {
                color: 0x0099ff,
                title: data.full_name,
                url: data.html_url,
                description: data.description || 'No description available.',
                fields: [
                    { name: 'Stars', value: data.stargazers_count.toString(), inline: true },
                    { name: 'Forks', value: data.forks_count.toString(), inline: true },
                    { name: 'Open Issues', value: data.open_issues_count.toString(), inline: true },
                ],
                footer: {
                    text: `Repository created on ${new Date(data.created_at).toDateString()}`,
                },
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching GitHub repository:', error);
            await interaction.reply({ content: 'An error occurred while fetching the repository information.', ephemeral: true });
        }
    },
};
