const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const partyOps = require('../database/partyOperations');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party-join')
    .setDescription('Join an existing party')
    .addIntegerOption(option =>
      option.setName('party-id')
        .setDescription('The ID of the party to join')
        .setRequired(true)),
        
  async execute(interaction) {
    const partyId = interaction.options.getInteger('party-id');
    
    try {
      // Check if party exists
      const party = await partyOps.getPartyById(partyId);
      
      if (!party) {
        return interaction.reply({
          content: `❌ Party with ID ${partyId} not found.`,
          ephemeral: true
        });
      }
      
      // Check if party is in the future
      if (new Date(party.scheduled_time) <= new Date()) {
        return interaction.reply({
          content: '❌ This party has already started or ended!',
          ephemeral: true
        });
      }
      
      // Check if party is full
      const memberCount = await partyOps.getPartyMemberCount(partyId);
      
      if (memberCount >= party.max_members) {
        return interaction.reply({
          content: '❌ This party is already full!',
          ephemeral: true
        });
      }
      
      // Check if already a member
      const isMember = await partyOps.isPartyMember(partyId, interaction.user.id);
      
      if (isMember) {
        return interaction.reply({
          content: '❌ You are already a member of this party!',
          ephemeral: true
        });
      }
      
      // Add user to party
      await partyOps.addPartyMember(partyId, interaction.user.id, interaction.user.username);
      
      const newMemberCount = memberCount + 1;
      const scheduledTime = new Date(party.scheduled_time);
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Successfully Joined Party!')
        .setDescription(`You've joined **${party.name}**`)
        .addFields(
          { name: 'Party ID', value: partyId.toString(), inline: true },
          { name: 'Scheduled Time', value: scheduledTime.toLocaleString(), inline: true },
          { name: 'Members', value: `${newMemberCount}/${party.max_members}`, inline: true },
          { name: 'Description', value: party.description }
        )
        .setTimestamp()
        .setFooter({ text: 'You will receive a notification before the party starts!' });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('[ERROR] Failed to join party:', error);
      await interaction.reply({
        content: '❌ Failed to join party. Please try again later.',
        ephemeral: true
      });
    }
  },
};
