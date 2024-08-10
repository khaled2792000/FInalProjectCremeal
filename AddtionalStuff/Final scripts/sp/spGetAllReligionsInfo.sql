USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Khaled Khalaf
-- Create date: 21/5/24
-- Description:	get all the religions from the system 
-- =============================================
create PROCEDURE [dbo].[spGetAllReligionsInfo] 
	@statusMessage nvarchar(255) output ,
	@status bit output
AS
BEGIN
	SET NOCOUNT ON;
	begin try 
		set @statusMessage = 'Loaded info successfuly'
		set @status = 0
		select * from [religion]
	end try 
	begin catch 
		set @statusMessage = 'Something went wrong'
		set @status = 1
	end catch 

END
