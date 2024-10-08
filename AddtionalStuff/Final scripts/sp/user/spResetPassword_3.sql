USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   24/4/24
-- Description:   Change the verified field to 1 in the user and delete the user code from the generated codes table
-- thied sp 
-- =============================================
create PROCEDURE [dbo].[spVerfieUser]
    @userId INT, -- We have this and we want to use it for optimizing the query
    @generatedCode NVARCHAR(5),
    @statusMessage NVARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check if the generated code is valid and not expired
        DECLARE @generationTime DATETIME = (
            SELECT [generated_time] 
            FROM [reseat_password] 
            WHERE [user_id] = @userId AND [auto_generated_code] = @generatedCode
        );

        IF @generationTime IS NOT NULL AND DATEDIFF(MINUTE, @generationTime, GETDATE()) < 30
        BEGIN
            -- Delete the code and update the user as verified
            DELETE FROM [reseat_password] WHERE [user_id] = @userId;
            UPDATE [user] SET [verfied_forReset] = 1 WHERE [id] = @userId;

            SET @statusMessage = 'User verified successfully';
            SET @status = 0;
        END
        ELSE
        BEGIN
            SET @statusMessage = 'Verification code is invalid or expired';
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
