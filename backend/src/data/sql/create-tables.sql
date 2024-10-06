-- create-tables.sql
-- SQL queries to create tables in the database if they do not exist
USE walletDB;

-- create users table
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
        points BIGINT DEFAULT 0
    );

    PRINT 'Table users created successfully';
END;

-- create quizzes table
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

    PRINT 'Table quizzes created successfully';
END;

-- create challenges table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'challenges')
BEGIN
    CREATE TABLE challenges (
        id INT PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        points INT NOT NULL,
        status INT
    );

    PRINT 'Table challenges created successfully';
END;

-- create points table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'points')
BEGIN
    CREATE TABLE points (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId NVARCHAR(255) FOREIGN KEY REFERENCES users(id),
        timestamp DATETIME DEFAULT GETDATE(),
        challengeId INT FOREIGN KEY REFERENCES challenges(id) DEFAULT NULL,
        quizDifficulty NVARCHAR(10) DEFAULT NULL,
        points INT NOT NULL
    );

    PRINT 'Table points created successfully';
END;

-- create supportQuestions table
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

    PRINT 'Table supportQuestions created successfully';
END;