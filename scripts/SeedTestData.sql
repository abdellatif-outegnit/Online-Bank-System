
SET IDENTITY_INSERT Roles ON;

insert into Roles (RoleID, RoleName) values(2, 'Customer')

SET IDENTITY_INSERT Roles OFF;



SET IDENTITY_INSERT Addresses ON;

insert into Addresses (AddressID, Country, City, Street, PostalCode) values(1012, 'morocco', 'rabat', 'rohan', '1520')

SET IDENTITY_INSERT Addresses OFF;



SET IDENTITY_INSERT Customers ON;

insert into Customers (CustomerID, FirstName, LastName, BirthDate, Status, PhoneNumber, AddressID, CreatedAt, UpdatedAt)
values(3015, 'test', 'test', GETDATE(), 1, '212662355488', 1012, GETDATE(), GETDATE(), 'TT1234')

SET IDENTITY_INSERT Customers OFF;



SET IDENTITY_INSERT Users ON;

insert into Users(UserID, EmailAddress, HashPassword, IsActive, LastLogin, CustomerID, RoleID, CreatedAt, UpdatedAt, ImagePath, RefreshTokenHash, RefreshTokenExpiresAt, RefreshTokenRevokedAt)
values(2021, 'test@gmail.com', 'test',1,GETDATE(), 3015, 2, GETDATE(), GETDATE(), null, null, null, null)

SET IDENTITY_INSERT Users OFF;


SET IDENTITY_INSERT Accounts ON;

insert into Accounts(AccountID, AccountNumber, AccountBalance, AccountType, AccountStatus, CustomerID, CreatedAt, UpdatedAt)
values(2008, '9999999999999999', 1000, 0, 0, 3015, GETDATE(), GETDATE())

SET IDENTITY_INSERT Accounts OFF;
