USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf 
-- Create date:   25/4/24
-- Updated:       10/8/24
-- Description:   Update user information
-- =============================================
create PROCEDURE [dbo].[spUpdateInformation]
    @userId INT, -- for indexing 
    @UserName VARCHAR(255),
    @UserEmail VARCHAR(255),
    @Allergic NVARCHAR(MAX) = '1', -- id,id,id....
    @ReligionId INT = 3,
    @StatusMessage VARCHAR(255) OUTPUT,
    @Status BIT OUTPUT -- 0 for success, 1 for errors
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Get current religion id for the user
        DECLARE @CurrentReligionId INT;
        SELECT @CurrentReligionId = religion_id FROM [user] WHERE [id] = @userId;

        -- Update user information
        UPDATE [user]
        SET [user_name] = @UserName,
            [user_email] = @UserEmail,
            religion_id = @ReligionId,
            last_update_time = GETDATE()
        WHERE [id] = @userId;

        -- Update religion count if the religion has changed
        IF @ReligionId <> @CurrentReligionId
        BEGIN
            -- Decrease count for the previous religion
            UPDATE [religion]
            SET [count] = [count] - 1
            WHERE [id] = @CurrentReligionId;

            -- Increase count for the new religion
            UPDATE [religion]
            SET [count] = [count] + 1
            WHERE [id] = @ReligionId;
        END

        -- Variables for spInsertAllergics
        DECLARE @statusMessage2 NVARCHAR(255);
        DECLARE @status2 BIT;

        -- Insert allergens
        EXEC spInsertAllergics 
            @allergic_ids = @Allergic, 
            @user_id = @userId,
            @statusMessage = @statusMessage2 OUTPUT,
            @status = @status2 OUTPUT;

        -- Check status from spInsertAllergics
        IF @status2 = 1
        BEGIN
            -- Rollback transaction if there is an error
            ROLLBACK TRANSACTION;
            THROW 51000, @statusMessage2, 1;
        END

        -- Commit transaction if everything is successful
        COMMIT TRANSACTION;

        SET @StatusMessage = 'Updated successfully'; 
        SET @Status = 0;
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of an error
        ROLLBACK TRANSACTION;
        SET @StatusMessage = ERROR_MESSAGE();
        SET @Status = 1;
    END CATCH
END
GO
