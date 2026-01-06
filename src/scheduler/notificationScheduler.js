const cron = require('node-cron');
const partyOps = require('../database/partyOperations');
const { EmbedBuilder } = require('discord.js');

/**
 * Start the notification scheduler
 * Runs every minute to check for pending notifications
 * 
 * Note: For high-load scenarios with many parties, consider:
 * - Using a longer interval (e.g., every 5 minutes)
 * - Implementing a more targeted query with time ranges
 * - Using a dedicated job queue system (Bull, Agenda, etc.)
 */
function start(client) {
  console.log('[INFO] Starting notification scheduler...');
  
  // Schedule to run every minute
  cron.schedule('* * * * *', async () => {
    try {
      await checkAndSendNotifications(client);
    } catch (error) {
      console.error('[ERROR] Notification scheduler error:', error);
    }
  });
  
  console.log('[INFO] Notification scheduler started (runs every minute)');
}

/**
 * Check for pending notifications and send them
 */
async function checkAndSendNotifications(client) {
  try {
    const notifications = await partyOps.getPendingNotifications();
    
    if (notifications.length === 0) {
      return;
    }
    
    console.log(`[INFO] Processing ${notifications.length} pending notification(s)`);
    
    for (const notification of notifications) {
      await sendPartyNotification(client, notification);
      await partyOps.markNotificationSent(notification.id);
    }
  } catch (error) {
    console.error('[ERROR] Failed to check notifications:', error);
  }
}

/**
 * Send a party notification to the designated channel
 */
async function sendPartyNotification(client, notification) {
  try {
    const channelId = process.env.NOTIFICATION_CHANNEL_ID;
    
    if (!channelId) {
      console.error('[ERROR] NOTIFICATION_CHANNEL_ID not set in environment');
      return;
    }
    
    const channel = await client.channels.fetch(channelId);
    
    if (!channel) {
      console.error(`[ERROR] Could not find channel with ID: ${channelId}`);
      return;
    }
    
    // Get party members to mention
    const members = await partyOps.getPartyMembers(notification.party_id);
    
    // Skip if no members to notify
    if (members.length === 0) {
      console.log(`[INFO] No members to notify for party: ${notification.party_name}`);
      return;
    }
    
    const memberMentions = members.map(m => `<@${m.user_id}>`).join(' ');
    
    const scheduledTime = new Date(notification.scheduled_time);
    const timeUntil = getTimeUntilString(scheduledTime);
    
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle(`🔔 Party Reminder: ${notification.party_name}`)
      .setDescription(`Your party is starting ${timeUntil}!`)
      .addFields(
        { name: 'Scheduled Time', value: scheduledTime.toLocaleString(), inline: true },
        { name: 'Party ID', value: notification.party_id.toString(), inline: true },
        { name: 'Members', value: members.length.toString(), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Get ready to party!' });
    
    await channel.send({
      content: memberMentions,
      embeds: [embed]
    });
    
    console.log(`[INFO] Sent notification for party: ${notification.party_name}`);
  } catch (error) {
    console.error('[ERROR] Failed to send notification:', error);
  }
}

/**
 * Helper function to format time until event
 */
function getTimeUntilString(futureDate) {
  const now = new Date();
  const diff = futureDate - now;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return 'very soon';
  }
}

module.exports = {
  start
};
