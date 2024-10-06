-- Enable the dblink extension
CREATE EXTENSION IF NOT EXISTS dblink;

-- Check if the database already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'walletdb') THEN
        RAISE NOTICE 'Creating database walletdb';
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE walletdb');
    ELSE
        RAISE NOTICE 'Database walletdb already exists';
    END IF;
END $$;

-- Connect to the database
\c walletdb

-- Create users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id VARCHAR(255) PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            imageUrl TEXT NOT NULL,
            password VARCHAR(255) NOT NULL,
            publicKey VARCHAR(255),
            joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            refreshToken TEXT,
            points BIGINT DEFAULT 0
        );
        RAISE NOTICE 'Users table created';
    END IF;
END $$;

-- Create quizzes table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quizzes') THEN
        CREATE TABLE quizzes (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            difficulty VARCHAR(50) NOT NULL,
            correctAnswer TEXT NOT NULL,
            option2 TEXT NOT NULL,
            option3 TEXT NOT NULL,
            option4 TEXT NOT NULL
        );
        RAISE NOTICE 'Quizzes table created';
    END IF;
END $$;

-- Create challenges table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'challenges') THEN
        CREATE TABLE challenges (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            points INT NOT NULL,
            status INT
        );
        RAISE NOTICE 'Challenges table created';
    END IF;
END $$;

-- Create points table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'points') THEN
        CREATE TABLE points (
            id SERIAL PRIMARY KEY,
            userId VARCHAR(255) REFERENCES users(id),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            challengeId INT REFERENCES challenges(id) DEFAULT NULL,
            quizDifficulty VARCHAR(50) DEFAULT NULL,
            points INT NOT NULL
        );
        RAISE NOTICE 'Points table created';
    END IF;
END $$;

-- Create supportQuestions table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supportQuestions') THEN
        CREATE TABLE supportQuestions (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            userId VARCHAR(255) REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            answered BOOLEAN DEFAULT FALSE,
            answer TEXT DEFAULT NULL
        );
        RAISE NOTICE 'SupportQuestions table created';
    END IF;
END $$;

DO $$
BEGIN
    RAISE NOTICE 'Initialization complete';
END $$;