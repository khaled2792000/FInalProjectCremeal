USE [igroup237_prod]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Khaled Khalaf
-- Create date: 26/4/24
-- upadated: 4/8/24
-- Description:	get user by email 
-- =============================================
alter PROCEDURE [dbo].[spGetUserByEmail]
	@insertedEmail nvarchar(255),
	
	@StatusMessage nvarchar(255) output ,
	@Status bit output
AS
BEGIN
	SET NOCOUNT ON;
	declare  @religion_id int;
	declare	 @religinon_title nvarchar(255);
	declare  @allergic_to nvarchar(max);
	begin try 
		select @religion_id = [religion_id]
		from [user]
		where [user_email] = @insertedEmail

		select @religinon_title = [religion_title]
		from [religion]
		where [id] = @religion_id

		SELECT @allergic_to = COALESCE(@allergic_to + ',', '') + (select [label] from Allergens where [id] = allergen_id) 
		FROM [user_allergens]
		where [user_id] = (select id from [user] where user_email = @insertedEmail)

		select [id] as [userId],[user_name],[password],[user_email],@allergic_to as [allergic_to],@religinon_title as [religion_title],[coins]
		from [user] where [user_email] = @insertedEmail;
		
		set @Status = 0;
        set @StatusMessage = 'Sended successfuly';
	end try 
	begin catch 
		set @Status = 1;
        set @StatusMessage = ERROR_MESSAGE();
	end catch 
    
END
