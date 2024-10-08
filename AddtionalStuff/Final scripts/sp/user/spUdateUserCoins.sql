USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   23/5/24
-- Description:   Update user coins by the ID
-- =============================================
CREATE PROCEDURE [dbo].[spUpdateUserCoins]
    @id INT,
    @coins INT,

    @statusMessage NVARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        
        BEGIN TRANSACTION;

        IF EXISTS (SELECT 1 FROM [user] WHERE [id] = @id)
        BEGIN
            -- Update the user's coins
            UPDATE [user]
            SET [coins] = @coins
            WHERE [id] = @id;

            -- Commit the transaction
            COMMIT TRANSACTION;

            -- Set success message and status
            SET @statusMessage = 'Updated successfully';
            SET @status = 0;
        END
        ELSE 
        BEGIN
            -- Rollback the transaction if user does not exist
            ROLLBACK TRANSACTION;

            -- Set failure message if user does not exist
            SET @statusMessage = 'User does not exist';
            SET @status = 1;
        END
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        ROLLBACK TRANSACTION;

        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
