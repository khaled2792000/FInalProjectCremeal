USE [igroup237_prod]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Khaled Khalaf
-- Create date: 7/8/24
-- Description: Insert a new transaction into the Transactions table
-- =============================================
alter PROCEDURE [dbo].[spInsertTransaction]
    @user_id INT,
    @amount BIGINT,
    @currency VARCHAR(3),
    @description TEXT,

    @statusMessage NVARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Begin a transaction
        BEGIN TRANSACTION;

        -- Insert the new transaction
        INSERT INTO [transaction]([user_id], amount, currency, description, date)
        VALUES (@user_id, @amount, @currency, @description, CURRENT_TIMESTAMP);
		
		-- Update the religion count
        UPDATE [statistics]
        SET [value] += @amount
        WHERE [id] = 2;

        -- Commit the transaction
        COMMIT TRANSACTION;

        SET @statusMessage = 'Transaction inserted successfully.';
        SET @status = 0;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of error
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END

        -- Capture and report the error
        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
