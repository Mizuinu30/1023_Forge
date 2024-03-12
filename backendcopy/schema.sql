-- Create databse and tables for the 1023_Forge project
CREATE DATABASE 1023_test;
USE 1023_test;
-- Create the user tables for the database
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    salt VARCHAR(128) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Create the campaign tables for the database
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    user_id VARCHAR(36) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Create the character tables for the database
CREATE TABLE characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    name VARCHAR(255),
    player VARCHAR(255),
    ac INT,
    speed INT,
    max_hp INT,
    current_hp INT,
    level INT,
    initiative INT,
    conditions VARCHAR(255),
    save_dc INT,
    passive_perception INT,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
-- Create the quest tables for the database
CREATE TABLE quests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    name VARCHAR(255),
    story TEXT,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
-- Many to Many relationship between campaigns and users so multiple users can join a campaign
CREATE TABLE campaign_users (
    user_id VARCHAR(36),
    campaign_id INT,
    joined TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, campaign_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE TABLE chatlogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    session_id INT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Populate the database with some test data
-- Insert a user
INSERT INTO users (id, username, password, salt, email)  -- Include salt in INSERT statement
VALUES
(UUID(), 'username1', SHA2('password1', 256), (SHA2('some_salt1', 256)), 'email1@example.com'),
(UUID(), 'username2', SHA2('password2', 256), (SHA2('some_salt2', 256)), 'email2@example.com'),
(UUID(), 'username3', SHA2('password3', 256), (SHA2('some_salt3', 256)), 'email3@example.com');

-- Get the salt for the user
SET @salt = (SELECT salt FROM users WHERE username = 'username_to_check');

-- Combine the salt and the provided password, and hash the result
SET @hashed_password = SHA2(CONCAT('password_to_check', @salt), 256);

-- Check if the hashed password matches the stored hash
SELECT * FROM users WHERE username = 'username_to_check' AND password = @hashed_password;

-- Get the UUID of the user we just inserted
SET @user_id1 = (SELECT id FROM users WHERE username = 'username1');
SET @user_id2 = (SELECT id FROM users WHERE username = 'username2');
SET @user_id3 = (SELECT id FROM users WHERE username = 'username3');

-- Insert campaigns for the user
INSERT INTO campaigns (name, user_id)
VALUES
('Campaign1', @user_id1),
('Campaign2', @user_id2),
('Campaign3', @user_id3);

-- Get the ID of the campaign we just inserted
SET @campaign_id1 = (SELECT id FROM campaigns WHERE name = 'Campaign1');
SET @campaign_id2 = (SELECT id FROM campaigns WHERE name = 'Campaign2');
SET @campaign_id3 = (SELECT id FROM campaigns WHERE name = 'Campaign3');

-- Insert a character for that campaign
INSERT INTO characters (campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception)
VALUES
(@campaign_id1, 'Character1', 'Player1', 10, 30, 100, 100, 1, 1, 'None', 10, 10),
(@campaign_id1, 'Character2', 'Player1', 15, 25, 50, 50, 1, 2, 'None', 15, 15),
(@campaign_id2, 'Character3', 'Player3', 20, 20, 75, 75, 1, 3, 'None', 20, 20);

-- Insert a quest for that campaign
INSERT INTO quests (campaign_id, name, story)
VALUES
(@campaign_id1, 'Quest1', 'This is the story of the quest.'),
(@campaign_id1, 'Quest2', 'This is the story of the quest.'),
(@campaign_id2, 'Quest3', 'This is the story of the quest.'),
(@campaign_id3, 'Quest4', 'This is the story of the quest.');


-- Insert users for the campaign
INSERT INTO campaign_users (user_id, campaign_id)
VALUES
(@user_id1, @campaign_id2),
(@user_id2, @campaign_id3),
(@user_id1, @campaign_id3);

-- Insert chatlogs for the campaign
INSERT INTO chatlogs (campaign_id, user_id, session_id, message, response)
VALUES
(@campaign_id1, @user_id1, 0, 'Hello, world!', 'Welcome to 1023 FORGE. Select a campaign to start!'),
(@campaign_id2, @user_id2, 0, 'Hello, world!', 'Welcome to 1023 FORGE. Select a campaign to start!'),
(@campaign_id3, @user_id3, 0, 'Hello, world!', 'Welcome to 1023 FORGE. Select a campaign to start!');