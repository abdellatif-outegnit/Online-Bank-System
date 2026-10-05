# Online Bank System

A learning-focused banking application built to demonstrate a full-stack banking workflow using ASP.NET Core, React, and Microsoft SQL Server. The project is intentionally educational: it models customer onboarding, authentication, accounts, cards, transfers, and transaction history in a single application suitable for coursework, demos, and interview walkthroughs.

This repository includes:
- Backend API in `BankBackEnd`
- Frontend app in `BankFrontEnd/bank-app`
- Database schema and scripts in `database/`

Repository About:
- Description: Online Bank System is an educational banking application built with ASP.NET Core and React to demonstrate account management, authentication, transfers, and transaction processing using SQL Server.
- Live website: [inquisitive-faloodeh-e9ae55.netlify.app](https://inquisitive-faloodeh-e9ae55.netlify.app/)
- Topics: csharp, aspnet-core, react, sql-server, educational-project

---

## Why this project exists

This project was created as an educational bank management sample to help students and developers understand:
- JWT-based authentication and refresh-token flow
- role-based account access
- account ownership validation
- double-entry style transfer logic
- SQL Server relational modeling
- API + frontend integration
- environment-based configuration
- transfer transaction safety and rollback patterns

It is not intended to be a production-grade banking platform and should not be used for real financial operations without additional security review, compliance work, and architectural hardening.

---

## Features

- User registration and login
- JWT access token issuance
- Refresh token rotation
- Logout flow
- Account creation and account lookup
- Customer profile and KYC-like data model
- Card creation and card metadata
- Deposit, withdraw, and transfer flows
- Transaction history and filtering
- Dashboard summary for recent transactions
- Responsive React front end
- SQL Server persistence

---

## Architecture

The repository is split into three main parts:

1. `BankBackEnd/BankWebApi`
   - ASP.NET Core 8 API
   - Controllers for auth, users, accounts, cards, and transfers
   - JWT authentication setup
   - CORS and config-based environment handling

2. `BankBackEnd/BankBusinessAccess`
   - Core business logic
   - Validation, ownership checks, transfer logic, and transaction orchestration

3. `BankBackEnd/BankDataAccess`
   - SQL client data access layer
   - Stored procedure calls and SQL operations

4. `BankFrontEnd/bank-app`
   - React + Vite app
   - Dashboard, transaction screens, account screens, settings, auth flows

5. `database/`
   - SQL schema and relational design files
   - Versioned setup scripts

Typical flow:
- Frontend sends requests to the API
- API validates JWT and user ownership
- Business layer checks balances and authorization
- Data access layer writes to SQL Server
- Transactions are created for ledger-style records

---

## Tech stack

- Backend: C#, ASP.NET Core 8
- Frontend: React 19, Vite
- Database: SQL Server / Azure SQL-compatible SQL Server
- Authentication: JWT bearer tokens
- Security helpers: BCrypt.Net-Next
- API docs: Swagger / Swashbuckle

---

## Project structure

```text
OnlineBank.worktrees/enhanced-readme-and-setup-guidelines
├── BankBackEnd
│   ├── BankBusinessAccess
│   ├── BankDataAccess
│   ├── BankWebApi
│   └── BankRestApi.sln
├── BankFrontEnd
│   └── bank-app
├── database
│   ├── SQLQueryFirstRS.sql
│   ├── SQLQuerySecondRS.sql
│   ├── SQLQueryThirdRS.sql
│   ├── FirstRelationalSchema.PNG
│   ├── SecondRelationalSchema.PNG
│   ├── ThirdRelationalSchema.PNG
│   └── ForthRelationalSchema.PNG
├── .gitignore
└── README.md
