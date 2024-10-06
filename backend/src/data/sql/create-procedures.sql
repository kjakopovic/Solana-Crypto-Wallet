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
		)
		SELECT *
		FROM rankedUsers
		WHERE placement <= @rank;
	END;
	')
END;

-- Procedure that returns the leaderboard of all users by points
IF OBJECT_ID(N'dbo.getPointsLeaderboard', N'P') IS NULL
BEGIN
	EXECUTE('
		CREATE PROCEDURE getPointsLeaderboard
		AS
		BEGIN
			SELECT CAST(DENSE_RANK() OVER (ORDER BY points DESC, username ASC) AS INT) AS placement,
				username,
				imageUrl,
				publicKey,
				CAST(points AS INT) AS points
			FROM USERS;
		END;
	')
END;

IF OBJECT_ID(N'dbo.fetchRandomQuizByDifficulty', N'P') IS NULL
BEGIN
    EXECUTE('
        CREATE PROCEDURE fetchRandomQuizByDifficulty
            @difficulty NVARCHAR(25),
            @number INT
        AS
        BEGIN
            SELECT id, question, difficulty, correctAnswer, option2, option3, option4
            FROM (
                    SELECT ROW_NUMBER() OVER(PARTITION BY difficulty ORDER BY difficulty ASC) AS Number, *
                    FROM quizzes
                    WHERE difficulty = @difficulty
                    ) AS subquery
            WHERE Number = @number;
        END;
    ')
END;