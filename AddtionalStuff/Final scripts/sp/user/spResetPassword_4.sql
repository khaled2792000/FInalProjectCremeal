USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   24/4/24
-- Updated date:  21/5/24
-- Description:   Check if the user has been verified and change the user password
-- =============================================
create PROCEDURE [dbo].[spResetPassword]
    @userId INT, -- We have this and we want to use it for optimizing the query
    @new_password NVARCHAR(255),
    @statusMessage NVARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check if user has been verified for password reset
        DECLARE @verified BIT = (SELECT [verfied_forReset] FROM [user] WHERE [id] = @userId);

        IF @verified = 1
        BEGIN
            -- Update the user password and reset the verification flag
            UPDATE [user] 
            SET [password] = @new_password, 
                [verfied_forReset] = 0,
                [last_update_time] = GETDATE()
            WHERE [id] = @userId;

            SET @statusMessage = 'Password reset successfully';
            SET @status = 0;
        END
        ELSE
        BEGIN
            SET @statusMessage = 'User is not verified for password reset';
            SET @status = 1;
        END
    END TRY
    BEGIN CATCH
        -- Handle errors and rollback changes
        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
GO
