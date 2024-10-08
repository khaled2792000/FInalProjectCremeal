use igroup237_prod
go 

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Khaled Khalaf
-- Create date: 23/4/24
-- Updated date: 4/8/24
-- Description:	login user compare the user password and retrive all the information about the user
-- in the server side we need to call more than one sp for retiving the relative informations if needed 
-- =============================================
alter PROCEDURE [dbo].[spLoginUser]
	@insertedEmail nvarchar(255),
	@insertedPassword nvarchar(255),

	@StatusMessage nvarchar(255) output ,
	@Status bit output

AS
BEGIN
	SET NOCOUNT ON;
	declare  @savedPassword nvarchar(255);
	declare  @religion_id int;
	declare	 @religinon_title nvarchar(255);
	declare  @allergic_to nvarchar(max);

	select @savedPassword = [password], @religion_id = [religion_id]
	from [user]
	where [user_email] = @insertedEmail

	select @religinon_title = [religion_title]
	from [religion]
	where [id] = @religion_id

	SELECT @allergic_to = COALESCE(@allergic_to + ',', '') + (select [label] from Allergens where [id] = allergen_id) 
	FROM [user_allergens]
	where [user_id] = (select id from [user] where user_email = @insertedEmail)
	
	-- in secury proccess is to not give the user indecation if the email is in the system
	-- prevent the hackers from guessing the passwords
	if @savedPassword is not null and @savedPassword = @insertedPassword
	begin
		select [user_name],[user_email],@allergic_to as [allergic_to],@religinon_title as [religion_title],[coins]
		from [user] where [user_email] = @insertedEmail;
		set @Status = 0;
        set @StatusMessage = 'Logined successfuly';
	end 
	else 
	begin 
		set @Status = 1;
        set @StatusMessage = 'Invalid username or password';
	end
END


