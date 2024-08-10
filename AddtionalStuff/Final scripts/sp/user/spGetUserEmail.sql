USE [igroup237_prod]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Khaled Khalaf
-- Create date: 26/4/24
-- Description:	get the user email by the id 
-- =============================================
create PROCEDURE [dbo].[spGetUserEmail]
	@userId int,

	@statusMessage nvarchar(255) output ,
	@status bit output
AS
BEGIN
	SET NOCOUNT ON;
	begin try 
		select [user_email] from [user] where [id] = @userId

		set @status = 0 
		set @statusMessage = 'Recived successfuly'
	end try 
	begin catch 
		set @status = 1
		set @statusMessage = ERROR_MESSAGE()
	end catch 
END
