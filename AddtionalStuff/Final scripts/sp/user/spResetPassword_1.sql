USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   24/4/24
-- Description:   Get the ID of the user to use in the next SP and save the user ID on the client side for a temporary time
-- =============================================
create PROCEDURE [dbo].[spGanAccessToResetePasswordGetUserId]
    @user_email NVARCHAR(255), -- The user email
    @statusMessage NVARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @userId INT;
        
        SELECT @userId = [id] FROM [user] WHERE [user_email] = @user_email;

        IF @userId IS NULL
        BEGIN
            SET @statusMessage = 'Invalid email address';
            SET @status = 1;
            SELECT -1 AS UserId;
        END
        ELSE
        BEGIN
            SET @statusMessage = 'User ID retrieved successfully';
            SET @status = 0;
            SELECT @userId AS UserId;
        END
    END TRY
    BEGIN CATCH
        -- Handle errors
        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
GO
