USE master;
GO

-- check if login already exists
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'dbAdmin')
BEGIN
    -- create login
    PRINT 'Creating login dbAdmin';
    CREATE LOGIN dbAdmin WITH PASSWORD = 'Password123!';
END
ELSE
BEGIN
    PRINT 'Login dbAdmin already exists';
END;
GO

-- check if the database already exists
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'walletDB')
BEGIN
   -- create database
    PRINT 'Creating database walletDB';
    CREATE DATABASE walletDB;
END
ELSE
BEGIN
    PRINT 'Database walletDB already exists';
END;
GO

-- use the database
USE walletDB;
GO

-- check if the user already exists
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'dbAdmin')
BEGIN
    -- create user
    PRINT 'Creating user dbAdmin';
    CREATE USER dbAdmin FOR LOGIN dbAdmin;
END
ELSE
BEGIN
    PRINT 'User dbAdmin already exists';
END;
GO

-- check if the user is a member of the db_owner role
IF NOT EXISTS (SELECT 1
               FROM sys.database_role_members drm
                        JOIN sys.database_principals dp ON dp.principal_id = drm.member_principal_id
                        JOIN sys.database_principals dp2 ON dp2.principal_id = drm.role_principal_id
               WHERE dp.name = 'dbAdmin' AND dp2.name = 'db_owner')
BEGIN
    -- add user to db_owner role
    PRINT 'Adding user dbAdmin to db_owner role';
    ALTER ROLE db_owner ADD MEMBER dbAdmin;
END
ELSE
BEGIN
    PRINT 'User dbAdmin is already a member of the db_owner role';
END;
GO

PRINT 'Making sure that tables exist';

-- Create users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
    CREATE TABLE users (
        id NVARCHAR(255) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL,
        imageUrl NVARCHAR(MAX) NOT NULL,
        password NVARCHAR(255) NOT NULL,
        publicKey NVARCHAR(255),
        joinedAt DATETIME DEFAULT GETDATE(),
        refreshToken NVARCHAR(MAX),
        points BIGINT,
    );

    PRINT 'Users table created';
END;
GO

-- Create quizzes table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'quizzes')
BEGIN
    CREATE TABLE quizzes (
        id INT PRIMARY KEY NOT NULL,
        question NVARCHAR(MAX) NOT NULL,
        difficulty NVARCHAR(50) NOT NULL,
        correctAnswer NVARCHAR(MAX) NOT NULL,
        option2 NVARCHAR(MAX) NOT NULL,
        option3 NVARCHAR(MAX) NOT NULL,
        option4 NVARCHAR(MAX) NOT NULL
    );

    PRINT 'Quizzes table created';
END;
GO

-- Create challenges table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'challenges')
BEGIN
    CREATE TABLE challenges (
        id INT PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        points INT NOT NULL,
        status INT
        );

    PRINT 'Challenges table created';
END;
GO

-- Create points table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'points')
BEGIN
    CREATE TABLE points(
        id INT PRIMARY KEY IDENTITY(1,1),
        userId NVARCHAR(255) FOREIGN KEY REFERENCES users(id),
        timestamp DATETIME DEFAULT GETDATE(),
        challengeId INT FOREIGN KEY REFERENCES challenges(id) DEFAULT NULL,
        quizDifficulty NVARCHAR(50) DEFAULT NULL,
        points INT NOT NULL
    );

    PRINT 'Points table created';
END;
GO

-- Create supportQuestions table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'supportQuestions')
BEGIN
    CREATE TABLE supportQuestions (
        id INT PRIMARY KEY IDENTITY(1,1),
        timestamp DATETIME DEFAULT GETDATE(),
        userId NVARCHAR(255) FOREIGN KEY REFERENCES users(id),
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        answered BIT DEFAULT 0,
        answer NVARCHAR(MAX) DEFAULT NULL
        );
    END;

    PRINT 'SupportQuestions table created';
END;
GO

PRINT 'Initialization complete';
GO