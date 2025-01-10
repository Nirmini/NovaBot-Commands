const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Helper function to check module existence
function checkModuleStatus(filePath) {
    const fullPath = path.resolve(__dirname, filePath);
    try {
        require(fullPath);
        return 'Operational 💚';
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return 'Missing 🟥';
        }
        return 'Error 🟡';
    }
}

// Helper function to check for files in directories
function checkDirectoryStatus(directoryPath) {
    const fullPath = path.resolve(__dirname, directoryPath);
    try {
        const files = fs.readdirSync(fullPath);
        return files.length > 0 ? 'Operational 💚' : 'Empty ⬜';
    } catch (error) {
        return 'Missing 🟥';
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modules')
        .setDescription('Module Status.'),
    async execute(interaction) {
        const creditsEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Nova Modules Status')
            .setAuthor({ name: 'Nova: XDebug' })
            .setThumbnail('https://i.imgur.com/nhqjXCq.png')
            .addFields(
                { name: '> ## **Core Module Files**', value: '\u200B' },
                { name: 'BotCore File:', value: checkModuleStatus('../../src/index.js') },
                { name: 'Sharding Mngr:', value: checkModuleStatus('../../src/shard-monitor.js') },
                { name: 'Nova Mngr:', value: checkModuleStatus('../../core/novamngr.cpp') },
                { name: '> ## **Global Modules**', value: '\u200B' },
                { name: 'ClientModule:', value: checkModuleStatus('../../core/global/Client.js') },
                { name: 'Statuspage:', value: checkModuleStatus('../../core/global/statuspage.js') },
                { name: 'CyroStellarEngine:', value: checkModuleStatus('../../core/CryostellarEngine.cpp') },
                { name: 'EclipticaRuntime:', value: checkModuleStatus('../../core/eclipticaruntime.cpp') },
                { name: '> ## **Command Modules**', value: '\u200B' },
                { name: 'Admin:', value: checkDirectoryStatus('../admin') },
                { name: 'Core:', value: checkDirectoryStatus('../core') },
                { name: 'Event:', value: checkDirectoryStatus('../event') },
                { name: 'Fun:', value: checkDirectoryStatus('../fun') },
                { name: 'Misc:', value: checkDirectoryStatus('../misc') },
                { name: 'Moderation:', value: checkDirectoryStatus('../moderation') },
                { name: 'ROBLOX:', value: checkDirectoryStatus('../roblox') },
                { name: 'UserMngmnt:', value: checkDirectoryStatus('../usermgmnt') },
            )
            .setTimestamp()
            .setFooter({ text: 'Have an amazing rest of your day! *mewo* - Blitz' });

        await interaction.reply({ embeds: [creditsEmbed] });
    },
};
