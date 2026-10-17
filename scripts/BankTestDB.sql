USE [master]
GO
/****** Objet : Database [OnlineBankDb] Date de script : 2026-10-17 10:07:58 PM ******/
CREATE DATABASE [OnlineBankDb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'OnlineBankDb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.MSSQLSERVER\MSSQL\DATA\OnlineBankDb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'OnlineBankDb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.MSSQLSERVER\MSSQL\DATA\OnlineBankDb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [OnlineBankDb] SET COMPATIBILITY_LEVEL = 170
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [OnlineBankDb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [OnlineBankDb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [OnlineBankDb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [OnlineBankDb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [OnlineBankDb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [OnlineBankDb] SET ARITHABORT OFF 
GO
ALTER DATABASE [OnlineBankDb] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [OnlineBankDb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [OnlineBankDb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [OnlineBankDb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [OnlineBankDb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [OnlineBankDb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [OnlineBankDb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [OnlineBankDb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [OnlineBankDb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [OnlineBankDb] SET  ENABLE_BROKER 
GO
ALTER DATABASE [OnlineBankDb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [OnlineBankDb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [OnlineBankDb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [OnlineBankDb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [OnlineBankDb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [OnlineBankDb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [OnlineBankDb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [OnlineBankDb] SET RECOVERY FULL 
GO
ALTER DATABASE [OnlineBankDb] SET  MULTI_USER 
GO
ALTER DATABASE [OnlineBankDb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [OnlineBankDb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [OnlineBankDb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [OnlineBankDb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [OnlineBankDb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [OnlineBankDb] SET OPTIMIZED_LOCKING = OFF 
GO
ALTER DATABASE [OnlineBankDb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'OnlineBankDb', N'ON'
GO
ALTER DATABASE [OnlineBankDb] SET QUERY_STORE = ON
GO
ALTER DATABASE [OnlineBankDb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
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
