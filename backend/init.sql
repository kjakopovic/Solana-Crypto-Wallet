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

PRINT 'Initialization complete';
GO

