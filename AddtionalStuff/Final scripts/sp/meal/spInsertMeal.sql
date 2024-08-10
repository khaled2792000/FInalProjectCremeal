USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   25/4/24
-- Updated:       21/5/24
-- Description:   Insert new meal into the meal table and log it in the user history
-- =============================================
create PROCEDURE [dbo].[spInsertMeal]
    @userId INT,
    @Name NVARCHAR(255),
    @ImageLink NVARCHAR(255),
    @Description NTEXT = 'Each bite is a delightful symphony of taste sensations.',
    @CookingTime INT,
    @Difficulty NVARCHAR(50),
    @Ingredients NVARCHAR(255),
    @Instructions NTEXT,

    @statusMessage VARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Check if the user exists
        IF NOT EXISTS (SELECT 1 FROM [user] WHERE [id] = @userId)
        BEGIN
            SET @statusMessage = 'User does not exist';
            SET @status = 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Check if the cooking time is valid
        IF @CookingTime < 0
        BEGIN
            SET @statusMessage = 'Invalid cooking time';
            SET @status = 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Check if the difficulty level is valid
        IF NOT EXISTS (SELECT 1 FROM (VALUES ('Easy'), ('Medium'), ('Hard')) AS DifficultyLevels(Difficulty) WHERE Difficulty = @Difficulty)
        BEGIN
            SET @statusMessage = 'Invalid difficulty level';
            SET @status = 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Insert the meal into the table
        INSERT INTO [meal] ([name], [imageLink], [description], [cooking_time], [difficulty], [ingredients], [instructions])
        VALUES (@Name, @ImageLink, @Description, @CookingTime, @Difficulty, @Ingredients, @Instructions);

        -- Update statistics
        UPDATE [statistics] SET [value] += 1 WHERE [id] = 3;
        
        -- Check if the meal was successfully inserted
        DECLARE @mealId INT = SCOPE_IDENTITY();
        IF @mealId IS NULL
        BEGIN
            SET @statusMessage = 'Failed to retrieve the meal ID';
            SET @status = 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insert the history
        INSERT INTO [meal_history] ([meal_id], [user_id], [favorit])
        VALUES (@mealId, @userId, 0);

        -- Commit transaction
        COMMIT TRANSACTION;
        SET @statusMessage = 'Meal inserted successfully';
        SET @status = 0;
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of an error
        ROLLBACK TRANSACTION;
        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
GO
