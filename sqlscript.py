#!/usr/bin/python3
"""A Sql Script to create a database and table in MySQL."""

import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

try:
    # Connect to the MySQL server
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password=''
    )

    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Create the database
    database_name = '1023_Forge'
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
    conn.database = database_name

    # Define SQL statements for table creation
    create_CharacterInformation = """
    CREATE TABLE IF NOT EXISTS CharacterInformation (
        Login_key INT AUTO_INCREMENT PRIMARY KEY,
        UserName VARCHAR(255),
        password VARCHAR(255),
        email VARCHAR(255),
        user_id_uuid VARCHAR(255),
        table_id VARCHAR(255)
    )
    """
    create_table_id = """
    CREATE TABLE IF NOT EXISTS table_id (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        player_character VARCHAR(255),
        campaign_name VARCHAR(255),
        chatgpt VARCHAR(255),
        non_player_character VARCHAR(255),
        campaign_uuid CHAR(36),
        login_key VARCHAR(255)
    )
    """
    create_campaign = """
    CREATE TABLE IF NOT EXISTS campaign (
        campaign_id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_name VARCHAR(255),
        campaign_uuid CHAR(36),
        login_key VARCHAR(255),
        lore VARCHAR(255),
        story VARCHAR(255),
        quest VARCHAR(255)
    )
    """
    create_non_player_character = """
    CREATE TABLE IF NOT EXISTS non_player_character (
        non_player_character_id INT AUTO_INCREMENT PRIMARY KEY,
        non_player_character_name VARCHAR(255),
        non_player_character_uuid CHAR(36),
        login_key VARCHAR(255),
        lore VARCHAR(255),
        story VARCHAR(255),
        quest VARCHAR(255)
    )
    """

    # Execute table creation commands
    cursor.execute(create_CharacterInformation)
    cursor.execute(create_table_id)
    cursor.execute(create_campaign)
    cursor.execute(create_non_player_character)

    # Commit the transaction
    conn.commit()

except mysql.connector.Error as error:
    print(f"Failed to create table in MySQL: {error}")
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
        print("MySQL connection is closed")

