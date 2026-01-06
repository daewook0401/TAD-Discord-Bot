const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify for async/await
const promisePool = pool.promise();

/**
 * Test database connection
 */
function connect(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err);
    }
    console.log('[INFO] Database connection established');
    connection.release();
    callback(null);
  });
}

/**
 * Initialize database tables
 */
function initializeTables(callback) {
  const createPartiesTable = `
    CREATE TABLE IF NOT EXISTS parties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      scheduled_time DATETIME NOT NULL,
      max_members INT DEFAULT 10,
      creator_id VARCHAR(255) NOT NULL,
      guild_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_scheduled_time (scheduled_time),
      INDEX idx_guild_id (guild_id)
    )
  `;

  const createPartyMembersTable = `
    CREATE TABLE IF NOT EXISTS party_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      party_id INT NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
      UNIQUE KEY unique_party_member (party_id, user_id),
      INDEX idx_party_id (party_id)
    )
  `;

  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      party_id INT NOT NULL,
      notification_time DATETIME NOT NULL,
      sent BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
      INDEX idx_notification_time (notification_time, sent)
    )
  `;

  pool.query(createPartiesTable, (err) => {
    if (err) return callback(err);
    
    pool.query(createPartyMembersTable, (err) => {
      if (err) return callback(err);
      
      pool.query(createNotificationsTable, (err) => {
        if (err) return callback(err);
        callback(null);
      });
    });
  });
}

/**
 * Execute a query
 */
async function query(sql, params) {
  try {
    const [results] = await promisePool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('[ERROR] Database query failed:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
function close() {
  pool.end((err) => {
    if (err) {
      console.error('[ERROR] Error closing database connection:', err);
    } else {
      console.log('[INFO] Database connection closed');
    }
  });
}

module.exports = {
  pool,
  promisePool,
  connect,
  initializeTables,
  query,
  close
};
