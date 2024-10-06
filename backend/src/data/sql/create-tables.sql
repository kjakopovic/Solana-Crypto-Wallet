-- create-tables.sql
-- SQL queries to create tables in the database if they do not exist

-- create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    imageUrl TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    publicKey VARCHAR(255),
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refreshToken TEXT,
    points BIGINT DEFAULT 0
);

-- create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    correctAnswer TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT NOT NULL,
    option4 TEXT NOT NULL
);

-- create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    points INT NOT NULL,
    status INT
);

-- create points table
CREATE TABLE IF NOT EXISTS points (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(255) REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    challengeId INT REFERENCES challenges(id) DEFAULT NULL,
    quizDifficulty VARCHAR(10) DEFAULT NULL,
    points INT NOT NULL
);

-- create supportQuestions table
CREATE TABLE IF NOT EXISTS supportQuestions (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId VARCHAR(255) REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    answered BOOLEAN DEFAULT FALSE,
    answer TEXT DEFAULT NULL
);