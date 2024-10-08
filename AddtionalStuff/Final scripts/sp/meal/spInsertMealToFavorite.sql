USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   1/8/24
-- Description:   Update favorite status for an existing meal in the meal history
-- =============================================
create PROCEDURE [dbo].[spInsertMealToFavorite]
    @UserId INT,
    @MealId INT,
    @statusMessage VARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Check if the user exists
        IF NOT EXISTS (SELECT 1 FROM [user] WHERE [id] = @UserId)
        BEGIN
            SET @statusMessage = 'User does not exist';
            SET @status = 1;
            RETURN;
        END;

        -- Check if the meal exists
        IF NOT EXISTS (SELECT 1 FROM [meal] WHERE [id] = @MealId)
        BEGIN
            SET @statusMessage = 'Meal does not exist';
            SET @status = 1;
            RETURN;
        END;

        -- Update the meal history favorit column
        UPDATE [meal_history]
        SET [favorit] = 1
        WHERE [user_id] = @UserId AND [meal_id] = @MealId;

        -- Check if the update was successful
        IF @@ROWCOUNT > 0
        BEGIN
            SET @statusMessage = 'Favorite status updated successfully';
            SET @status = 0;
        END
        ELSE
        BEGIN
            SET @statusMessage = 'Meal history record not found or already updated';
            SET @status = 1;
        END;
    END TRY
    BEGIN CATCH
        -- Capture and report any errors
        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
