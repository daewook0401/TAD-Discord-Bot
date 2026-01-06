const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display all available commands'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🤖 TAD Discord Bot - Help')
      .setDescription('Here are all available commands:')
      .addFields(
        {
          name: '🎉 Party Commands',
          value: [
            '`/party-create` - Create a new party',
            '`/party-join` - Join an existing party',
            '`/party-leave` - Leave a party',
            '`/party-list` - List all active parties',
            '`/party-info` - Get detailed party information'
          ].join('\n'),
          inline: false
        },
        {
          name: '⚙️ General Commands',
          value: [
            '`/help` - Display this help message',
            '`/ping` - Check bot latency'
          ].join('\n'),
          inline: false
        },
        {
          name: '📋 How to Use',
          value: [
            '1. Create a party with `/party-create`',
            '2. Share the Party ID with friends',
            '3. Friends can join using `/party-join`',
            '4. Get notifications before party starts!',
            '5. Leave anytime with `/party-leave`'
          ].join('\n'),
          inline: false
        },
        {
          name: '🔔 Notifications',
          value: 'The bot will automatically send notifications 1 hour before each party starts!',
          inline: false
        }
      )
      .setTimestamp()
      .setFooter({ text: 'TAD Discord Bot - Party Scheduler' });
    
    await interaction.reply({ embeds: [embed] });
  },
};
