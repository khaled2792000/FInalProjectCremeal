USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Khaled Khalaf
-- Create date: 21/5/24
-- Description:	get all the users from the system 
-- =============================================
create PROCEDURE [dbo].[spGetAllUsresInfo] 
	@statusMessage varchar(255) output,
	@status bit output -- 0 there are no errors 1 there are 
AS
BEGIN
	SET NOCOUNT ON;
	begin try 
		set @statusMessage = 'Loaded info successfuly'
		set @status = 0
		SELECT 
			u.*, 
			r.religion_title,
			(
				SELECT 
					STUFF((
						SELECT ',' + a.[label]
						FROM [user_allergens] ua
						JOIN [allergens] a ON ua.allergen_id = a.id
						WHERE ua.[user_id] = u.id
						FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '')
			) AS allergic_to
		FROM 
			[user] AS u 
		JOIN 
			[religion] AS r ON u.religion_id = r.id;
	end try 
	begin catch 
		set @statusMessage = 'Something went wrong'
		set @status = 1
	end catch 

END
