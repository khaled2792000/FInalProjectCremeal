USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Khaled Khalaf
-- Create date: 21/5/24
-- Description:	get all statistics 
-- =============================================
create PROCEDURE [dbo].[spGetAllStatistics]
	@statusMessage nvarchar(255) output ,
	@status bit output
AS
BEGIN
	begin try
	SET NOCOUNT ON;
		set @statusMessage = 'Loaded info successfuly'
		set @status = 0
		select * from [statistics]
    end try 
	begin catch
		set @statusMessage = 'Something went wrong'
		set @status = 1
	end catch 
END
