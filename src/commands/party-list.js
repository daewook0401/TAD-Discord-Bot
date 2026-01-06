const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const partyOps = require('../database/partyOperations');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party-list')
    .setDescription('List all active parties in this server'),
        
  async execute(interaction) {
    try {
      const parties = await partyOps.getActiveParties(interaction.guildId);
      
      if (parties.length === 0) {
        return interaction.reply({
          content: '📭 No active parties found. Create one with `/party-create`!',
          ephemeral: true
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🎉 Active Parties')
        .setDescription(`Found ${parties.length} active party/parties`)
        .setTimestamp();
      
      for (const party of parties.slice(0, 10)) { // Limit to 10 parties
        const scheduledTime = new Date(party.scheduled_time);
        const memberCount = party.member_count || 0;
        
        embed.addFields({
          name: `${party.name} (ID: ${party.id})`,
          value: [
            `📅 **Time:** ${scheduledTime.toLocaleString()}`,
            `👥 **Members:** ${memberCount}/${party.max_members}`,
            `📝 **Description:** ${party.description}`,
            `🎭 **Creator:** <@${party.creator_id}>`
          ].join('\n'),
          inline: false
        });
      }
      
      if (parties.length > 10) {
        embed.setFooter({ text: `Showing 10 of ${parties.length} parties` });
      }
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('[ERROR] Failed to list parties:', error);
      await interaction.reply({
        content: '❌ Failed to retrieve party list. Please try again later.',
        ephemeral: true
      });
    }
  },
};
