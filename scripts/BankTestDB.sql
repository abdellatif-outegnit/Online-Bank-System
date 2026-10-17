
USE [OnlineBankDb]
GO
/****** Objet : UserDefinedTableType [dbo].[TransactionTypeList] Date de script : 2026-10-17 10:07:58 PM ******/
CREATE TYPE [dbo].[TransactionTypeList] AS TABLE(
	[TransactionType] [tinyint] NULL
)
GO
/****** Objet : Table [dbo].[Accounts] Date de script : 2026-10-17 10:07:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accounts](
	[AccountID] [int] IDENTITY(1,1) NOT NULL,
	[AccountNumber] [nvarchar](34) NOT NULL,
	[AccountBalance] [decimal](18, 2) NOT NULL,
	[AccountType] [tinyint] NOT NULL,
	[AccountStatus] [tinyint] NOT NULL,
	[CustomerID] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AccountID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Accounts_AccountNumber] UNIQUE NONCLUSTERED 
(
	[AccountNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objet : Table [dbo].[Addresses] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Addresses](
	[AddressID] [int] IDENTITY(1,1) NOT NULL,
	[Country] [nvarchar](30) NOT NULL,
	[City] [nvarchar](30) NOT NULL,
	[Street] [nvarchar](30) NOT NULL,
	[PostalCode] [nvarchar](30) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AddressID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objet : Table [dbo].[Cards] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cards](
	[CardID] [int] IDENTITY(1,1) NOT NULL,
	[AccountID] [int] NOT NULL,
	[CardNumber] [varchar](16) NOT NULL,
	[CardHolderName] [varchar](100) NOT NULL,
	[ExpirationDate] [datetime2](7) NOT NULL,
	[CardType] [tinyint] NOT NULL,
	[CardBrand] [tinyint] NOT NULL,
	[Status] [tinyint] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK__Cards__55FECD8EDC297B8E] PRIMARY KEY CLUSTERED 
(
	[CardID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Cards_CardNumber] UNIQUE NONCLUSTERED 
(
	[CardNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objet : Table [dbo].[Customers] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[CustomerID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](30) NOT NULL,
	[LastName] [nvarchar](30) NOT NULL,
	[BirthDate] [datetime2](7) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[PhoneNumber] [nvarchar](15) NOT NULL,
	[AddressID] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
	[NationalID] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CustomerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Customers_NationalId] UNIQUE NONCLUSTERED 
(
	[NationalID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objet : Table [dbo].[Roles] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleID] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objet : Table [dbo].[Transactions] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transactions](
	[TransactionID] [int] IDENTITY(1,1) NOT NULL,
	[TransactionType] [tinyint] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[BalanceAfter] [decimal](18, 2) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[Reference] [nvarchar](100) NOT NULL,
	[AccountID] [int] NOT NULL,
	[RelatedAccountID] [int] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TransactionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objet : Table [dbo].[Users] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[EmailAddress] [nvarchar](254) NOT NULL,
	[HashPassword] [nvarchar](255) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[LastLogin] [datetime2](7) NULL,
	[CustomerID] [int] NOT NULL,
	[RoleID] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
	[ImagePath] [nvarchar](200) NULL,
	[RefreshTokenHash] [nvarchar](500) NULL,
	[RefreshTokenExpiresAt] [datetime2](7) NULL,
	[RefreshTokenRevokedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Users_EmailAddress] UNIQUE NONCLUSTERED 
(
	[EmailAddress] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Accounts] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Accounts] ADD  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Cards] ADD  CONSTRAINT [DF__Cards__CreatedAt__03F0984C]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Customers] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Customers] ADD  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Transactions] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Transactions] ADD  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Accounts]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customers] ([CustomerID])
GO
ALTER TABLE [dbo].[Cards]  WITH CHECK ADD  CONSTRAINT [FK_Cards_Accounts] FOREIGN KEY([AccountID])
REFERENCES [dbo].[Accounts] ([AccountID])
GO
ALTER TABLE [dbo].[Cards] CHECK CONSTRAINT [FK_Cards_Accounts]
GO
ALTER TABLE [dbo].[Customers]  WITH CHECK ADD FOREIGN KEY([AddressID])
REFERENCES [dbo].[Addresses] ([AddressID])
GO
ALTER TABLE [dbo].[Transactions]  WITH CHECK ADD FOREIGN KEY([AccountID])
REFERENCES [dbo].[Accounts] ([AccountID])
GO
ALTER TABLE [dbo].[Transactions]  WITH CHECK ADD FOREIGN KEY([RelatedAccountID])
REFERENCES [dbo].[Accounts] ([AccountID])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customers] ([CustomerID])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([RoleID])
REFERENCES [dbo].[Roles] ([RoleID])
GO
/****** Objet : StoredProcedure [dbo].[GetCustomerTransactions] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetCustomerTransactions]
    @CustomerID INT,
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SELECT
        t.TransactionID,
        t.TransactionType,
        t.Amount,
        t.BalanceAfter,
        t.Status,
        t.Reference,
        t.AccountID,
        t.RelatedAccountID,
        t.CreatedAt,

        COUNT(*) OVER() AS TotalCount,
        
        SUM(
            CASE
                WHEN t.TransactionType IN (0, 3) THEN t.Amount
                ELSE 0
            END
        ) OVER() AS TotalIncome,

        SUM(
            CASE
                WHEN t.TransactionType IN (1, 2) THEN t.Amount
                ELSE 0
            END
        ) OVER() AS TotalExpense

    FROM Transactions t
    INNER JOIN Accounts a
        ON t.AccountID = a.AccountID
    WHERE a.CustomerID = @CustomerID

    ORDER BY t.CreatedAt DESC

    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO
/****** Objet : StoredProcedure [dbo].[GetFilteredCustomerTransactions] Date de script : 2026-10-17 10:07:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetFilteredCustomerTransactions]
    @CustomerID INT,
    @PageNumber INT = 1,
    @PageSize INT = 10,


    @AccountType TINYINT = NULL,
    @TransactionTypes TransactionTypeList READONLY,
    @Status TINYINT = NULL,


    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
AS
BEGIN


    SELECT
        t.TransactionID,
        t.TransactionType,
        t.Amount,
        t.BalanceAfter,
        t.Status,
        t.Reference,
        t.AccountID,
        t.RelatedAccountID,
        t.CreatedAt,

        COUNT(*) OVER() AS TotalCount,
        
        SUM(
            CASE
                WHEN t.TransactionType IN (0, 3) THEN t.Amount
                ELSE 0
            END
        ) OVER() AS TotalIncome,

        SUM(
            CASE
                WHEN t.TransactionType IN (1, 2) THEN t.Amount
                ELSE 0
            END
        ) OVER() AS TotalExpense


    FROM Transactions t


    INNER JOIN Accounts a
        ON t.AccountID = a.AccountID


    WHERE a.CustomerID = @CustomerID


        -- Account type
        AND (
            @AccountType IS NULL
            OR a.AccountType = @AccountType
        )


        -- Transaction type
         AND (
          NOT EXISTS (SELECT 1 FROM @TransactionTypes)
          OR t.TransactionType IN (
              SELECT TransactionType
              FROM @TransactionTypes
          )
      )


        -- Status
        AND (
            @Status IS NULL
            OR t.Status = @Status
        )


        -- From date
        AND (
            @FromDate IS NULL
            OR t.CreatedAt >= @FromDate
        )

        -- To date
        AND (
            @ToDate IS NULL
            OR t.CreatedAt <= @ToDate
        )
    ORDER BY t.CreatedAt DESC

    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

END;
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0-checking, 1-saving' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Accounts', @level2type=N'COLUMN',@level2name=N'AccountType'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0-active, 1-frozen, 2-closed' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Accounts', @level2type=N'COLUMN',@level2name=N'AccountStatus'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0-pending, 1-active, 2-suspended, 3-closed' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Customers', @level2type=N'COLUMN',@level2name=N'Status'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0-deposit , 1-withdraw, 2-transferTo, 3-transferFrom' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Transactions', @level2type=N'COLUMN',@level2name=N'TransactionType'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0-Completed, 1-Reversed' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Transactions', @level2type=N'COLUMN',@level2name=N'Status'
GO
USE [master]
GO
ALTER DATABASE [OnlineBankDb] SET  READ_WRITE 
GO
