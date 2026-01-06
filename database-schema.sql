-- TAD Discord Bot Database Schema
-- This file is for reference only. Tables are automatically created by the bot.

-- Create database
CREATE DATABASE IF NOT EXISTS tad_discord_bot;
USE tad_discord_bot;

-- Parties table
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
);

-- Party members table
CREATE TABLE IF NOT EXISTS party_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  party_id INT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_party_member (party_id, user_id),
  INDEX idx_party_id (party_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  party_id INT NOT NULL,
  notification_time DATETIME NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
  INDEX idx_notification_time (notification_time, sent)
);
