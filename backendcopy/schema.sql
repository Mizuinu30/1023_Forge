-- Create databse and tables for the 1023_Forge project
CREATE DATABASE 1023_test;
USE 1023_test;

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    user_id CHAR(36),
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
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

CREATE TABLE quests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    name VARCHAR(255),
    story TEXT,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Many to Many relationship between campaigns and users so multiple users can join a campaign
-- CREATE TABLE campaign_users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     campaign_id INT,
--     user_id UUID,
--     created TIMESTAMP NOT NULL DEFAULT NOW(),
--     FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- Populate the database with some test data
-- Insert a user
INSERT INTO users (id, username, password, email)
VALUES (UUID(), 'username1', 'password1', 'email1@example.com');

-- Get the UUID of the user we just inserted
SET @user_id = (SELECT id FROM users WHERE username = 'username1');

-- Insert a campaign for that user
INSERT INTO campaigns (name, user_id)
VALUES ('Campaign1', @user_id);

-- Get the ID of the campaign we just inserted
SET @campaign_id = (SELECT id FROM campaigns WHERE name = 'Campaign1');

-- Insert a character for that campaign
INSERT INTO characters (campaign_id, name, player, ac, speed, max_hp, current_hp, level, initiative, conditions, save_dc, passive_perception)
VALUES (@campaign_id, 'Character1', 'Player1', 10, 30, 100, 100, 1, 1, 'None', 10, 10);

-- Insert a quest for that campaign
INSERT INTO quests (campaign_id, name, story)
VALUES (@campaign_id, 'Quest1', 'This is the story of the quest.');