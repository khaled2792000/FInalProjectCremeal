USE [igroup237_prod]
GO
/****** Object:  StoredProcedure [dbo].[spGetAllHistoryForUser]    Script Date: 8/10/2024 3:07:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Khaled khalaf
-- Create date:	27/4/24
-- Description:	get all the meals for the user
-- =============================================
create PROCEDURE [dbo].[spGetAllHistoryForUser]
	@userId int,

	@StatusMessage varchar(255) OUTPUT,
    @Status bit OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	begin try
		select [meal].*,[meal_history].favorit from [meal] join [meal_history] on [meal_history].[meal_id] = [meal].[id] where [meal_history].[user_id] = @userId
		SET @StatusMessage = 'Returned melas successfuly';
		SET @Status = 0;
	end try
	begin catch
		SET @StatusMessage = ERROR_MESSAGE();
		SET @Status = 1;
	end catch
END
