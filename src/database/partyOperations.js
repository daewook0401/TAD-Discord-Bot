const db = require('./connection');

/**
 * Create a new party
 */
async function createParty(partyData) {
  const { name, description, scheduledTime, maxMembers, creatorId, guildId } = partyData;
  
  const sql = `
    INSERT INTO parties (name, description, scheduled_time, max_members, creator_id, guild_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const result = await db.query(sql, [name, description, scheduledTime, maxMembers, creatorId, guildId]);
  return result.insertId;
}

/**
 * Get party by ID
 */
async function getPartyById(partyId) {
  const sql = 'SELECT * FROM parties WHERE id = ?';
  const results = await db.query(sql, [partyId]);
  return results[0];
}

/**
 * Get all active parties for a guild
 */
async function getActiveParties(guildId) {
  const sql = `
    SELECT p.*, COUNT(pm.id) as member_count
    FROM parties p
    LEFT JOIN party_members pm ON p.id = pm.party_id
    WHERE p.guild_id = ? AND p.scheduled_time > NOW()
    GROUP BY p.id
    ORDER BY p.scheduled_time ASC
  `;
  
  return await db.query(sql, [guildId]);
}

/**
 * Delete a party
 */
async function deleteParty(partyId) {
  const sql = 'DELETE FROM parties WHERE id = ?';
  await db.query(sql, [partyId]);
}

/**
 * Add member to party
 */
async function addPartyMember(partyId, userId, username) {
  const sql = `
    INSERT INTO party_members (party_id, user_id, username)
    VALUES (?, ?, ?)
  `;
  
  try {
    await db.query(sql, [partyId, userId, username]);
    return true;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return false; // Already a member
    }
    throw error;
  }
}

/**
 * Remove member from party
 */
async function removePartyMember(partyId, userId) {
  const sql = 'DELETE FROM party_members WHERE party_id = ? AND user_id = ?';
  const result = await db.query(sql, [partyId, userId]);
  return result.affectedRows > 0;
}

/**
 * Get party members
 */
async function getPartyMembers(partyId) {
  const sql = 'SELECT * FROM party_members WHERE party_id = ? ORDER BY joined_at ASC';
  return await db.query(sql, [partyId]);
}

/**
 * Get member count for a party
 */
async function getPartyMemberCount(partyId) {
  const sql = 'SELECT COUNT(*) as count FROM party_members WHERE party_id = ?';
  const results = await db.query(sql, [partyId]);
  return results[0].count;
}

/**
 * Check if user is a member of party
 */
async function isPartyMember(partyId, userId) {
  const sql = 'SELECT COUNT(*) as count FROM party_members WHERE party_id = ? AND user_id = ?';
  const results = await db.query(sql, [partyId, userId]);
  return results[0].count > 0;
}

/**
 * Create notification for party
 */
async function createNotification(partyId, notificationTime) {
  const sql = `
    INSERT INTO notifications (party_id, notification_time)
    VALUES (?, ?)
  `;
  
  await db.query(sql, [partyId, notificationTime]);
}

/**
 * Get pending notifications
 */
async function getPendingNotifications() {
  const sql = `
    SELECT n.*, p.name as party_name, p.scheduled_time, p.guild_id
    FROM notifications n
    JOIN parties p ON n.party_id = p.id
    WHERE n.sent = FALSE AND n.notification_time <= NOW()
  `;
  
  return await db.query(sql);
}

/**
 * Mark notification as sent
 */
async function markNotificationSent(notificationId) {
  const sql = 'UPDATE notifications SET sent = TRUE WHERE id = ?';
  await db.query(sql, [notificationId]);
}

module.exports = {
  createParty,
  getPartyById,
  getActiveParties,
  deleteParty,
  addPartyMember,
  removePartyMember,
  getPartyMembers,
  getPartyMemberCount,
  isPartyMember,
  createNotification,
  getPendingNotifications,
  markNotificationSent
};
