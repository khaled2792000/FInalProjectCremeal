USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Khaled Khalaf
-- Create date:   8/10/24
-- Description:   Update plan details by the id 
-- =============================================
create PROCEDURE [dbo].[spUpdatePlan]
    @id INT,
    @plan_title NVARCHAR(255),
    @coins_amount INT,
    @price FLOAT,

    @statusMessage NVARCHAR(255) OUTPUT,
    @status BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Validate the input values
        IF @coins_amount <= 0
        BEGIN
            SET @statusMessage = 'Coins amount must be greater than 0';
            SET @status = 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        IF @price <= 0
        BEGIN
            SET @statusMessage = 'Price must be greater than 0';
            SET @status = 1;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Update the plan details
        UPDATE [plan]
        SET [plan_title] = @plan_title,
            [coins_amount] = @coins_amount,
            [price] = @price
        WHERE [id] = @id;

        -- Check if any row was updated
        IF @@ROWCOUNT = 0
        BEGIN
            -- If no rows were updated, rollback the transaction and set the status to indicate failure
            ROLLBACK TRANSACTION;
            SET @statusMessage = 'No plan found with the given id';
            SET @status = 1;
            RETURN;
        END;

        -- Commit the transaction if successful
        COMMIT TRANSACTION;

        SET @statusMessage = 'Plan updated successfully';
        SET @status = 0;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of error
        ROLLBACK TRANSACTION;

        -- Capture and report any errors
        SET @statusMessage = ERROR_MESSAGE();
        SET @status = 1;
    END CATCH
END
