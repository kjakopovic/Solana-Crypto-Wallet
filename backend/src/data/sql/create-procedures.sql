--create-procedures.sql
-- SQL queries to create stored procedures in the database if they do not exist

-- Procedure that returns given amount of top ranked users by points
IF OBJECT_ID(N'dbo.getTopRankedUsers', N'P') IS NULL
BEGIN
	EXECUTE('
	CREATE PROCEDURE getTopRankedUsers
    @rank INT
	AS
	BEGIN
		WITH rankedUsers AS (
			SELECT
				CAST(DENSE_RANK() OVER (ORDER BY points DESC, username ASC) AS INT) AS placement,
				username,
				imageUrl,
				publicKey,
				CAST(points AS INT) AS points
			FROM users
			WHERE points IS NOT NULL
		)
		SELECT *
		FROM rankedUsers
		WHERE placement <= @rank;
	END;
	')
END;

-- Procedure that returns the leaderboard of all users by points
IF OBJECT_ID(N'dbo.GetPointsLeaderboard', N'P') IS NULL
BEGIN
	EXECUTE('
		CREATE PROCEDURE GetPointsLeaderboard
		AS
		BEGIN
			SELECT CAST(DENSE_RANK() OVER (ORDER BY points DESC, username ASC) AS INT) AS placemenet,
				username,
				imageUrl,
				publicKey,
				CAST(points AS INT) AS points
			FROM USERS
			WHERE points IS NOT NULL;
		END;
	')
END;