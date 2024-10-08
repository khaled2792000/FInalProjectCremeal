USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   25/4/24
-- Description:   Get all meals for the user with the given id
-- =============================================
ALTER PROCEDURE [dbo].[spGetMealHistory]
    @user_id INT,
    @StatusMessage VARCHAR(255) OUTPUT,
    @Status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        SELECT 
            m.*, 
            h.[favorit]
        FROM 
            [meal] AS m
        INNER JOIN 
            [meal_history] AS h
        ON 
            m.[id] = h.[meal_id]
        WHERE 
            h.[user_id] = @user_id;

        SET @StatusMessage = 'Successfully loaded meals.';
        SET @Status = 0;
    END TRY
    BEGIN CATCH
        -- Capture and report any errors
        SET @StatusMessage = ERROR_MESSAGE();
        SET @Status = 1;
    END CATCH
END
GO
