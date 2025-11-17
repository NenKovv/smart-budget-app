# SmartBudget - Brainstorming Session Summary

**Date:** 2025-11-17
**Facilitator:** Plamena (Product Manager)
**Participants:** Aneliya, Plamena, Arhinna, Deva, Iulia, Silvia, Kalina, Darina

---

## Session Objective

Explore the vision, features, and scope for SmartBudget personal finance application through collaborative discussion.

---

## Key Insights from Discussion

### User Pain Points Identified

1. **Complexity overload**: Most apps throw too many features at users (investments, crypto, loans) when many just want basic expense tracking
2. **Poor transaction categorization**: Users waste time manually categorizing transactions
3. **Lack of actionable insights**: Apps show charts but don't suggest actionable budget improvements
4. **Mobile-first neglect**: Many apps prioritize desktop when users want quick mobile entry

### Proposed Solution

**Focus on "Simplicity + Intelligence":**
- Core categories (Income, Rent, Salary, Transport, Groceries, Others)
- Clean dashboard with visual spending summaries
- Optional AI-based budget optimization suggestions (Phase 2)
- Mobile-first approach

---

## Technology Stack Decision

### Frontend: React 18 + TypeScript
**Rationale:**
- Largest ecosystem for UI libraries (Material-UI is production-proven)
- Recharts integrates seamlessly
- Team has experience
- Highest hiring pool for future expansion

### Backend: Node.js + Express + TypeScript
**Rationale:**
- JavaScript full-stack (shared language)
- Express is battle-tested and lightweight
- TypeScript adds safety without complexity
- Trivial Heroku deployment

### Database: PostgreSQL
**Rationale:**
- Perfect fit for relational data (users → transactions → budgets)
- Excellent aggregation for dashboard queries
- Heroku Postgres add-on is seamless
- Future-proof for complex features

---

## MVP Scope Consensus

**Must-Have Features (8 weeks):**
- User authentication (email/password only)
- Manual transaction entry
- Monthly dashboard with spending breakdown
- Budget limits with 90% alerts
- Transaction history with category filtering

**Deferred to Phase 2:**
- Social login (OAuth)
- Bank account integration
- AI suggestions
- Export reports
- Custom categories

---

## Key Decisions Made

| Decision Point | Option Chosen | Rationale |
|----------------|---------------|-----------|
| Authentication | Email/password only | OAuth adds complexity for MVP |
| User Model | Single-user accounts | Multi-user complicates data model |
| Categories | Fixed 6 categories | Sufficient for MVP, custom in Phase 2 |
| Budget Period | Monthly only | Weekly/yearly based on user feedback later |
| Deployment | Heroku | Quick deployment, free tier for MVP |

---

## User Stories (Draft)

### Epic 1: User Management
- US1.1: As a new user, I want to create an account
- US1.2: As a returning user, I want to log in securely

### Epic 2: Transaction Management
- US2.1: As a user, I want to add a transaction with amount, category, note
- US2.2: As a user, I want to view transaction history filtered by category
- US2.3: As a user, I want to edit/delete transactions

### Epic 3: Budget Tracking
- US3.1: As a user, I want to set monthly budget limits
- US3.2: As a user, I want alerts when close to limits (90%)
- US3.3: As a user, I want to see remaining budget

### Epic 4: Dashboard & Insights
- US4.1: As a user, I want visual spending breakdown by category
- US4.2: As a user, I want to see monthly income vs expenses
- US4.3: As a user, I want to see spending trends

---

## Information Architecture

```
SmartBudget App
├── Authentication
│   ├── Sign Up
│   ├── Log In
│   └── Password Reset (Phase 2)
├── Dashboard (Home)
│   ├── Monthly Summary Card
│   ├── Spending Breakdown Chart
│   └── Budget Alerts
├── Transactions
│   ├── Add Transaction (Modal)
│   ├── Transaction List (Filterable)
│   └── Edit/Delete Transaction
└── Settings
    ├── Budget Limits
    ├── Profile
    └── Logout
```

---

## Next Steps Assigned

1. **Aneliya**: Finalize user stories and acceptance criteria → Product Brief
2. **Iulia**: Create wireframes for Dashboard and Add Transaction flows
3. **Arhinna**: Document database schema and API contracts
4. **Deva**: Set up project infrastructure (repo, CI/CD, test framework)
5. **Kalina**: Define test strategy and coverage requirements
6. **Darina**: Prepare deployment pipeline and monitoring setup
7. **Silvia**: Create sprint plan and task breakdown

---

## Open Questions Resolved

**Q: Multi-currency support?**
A: EUR only for MVP, multi-currency in Phase 3

**Q: Data retention policy?**
A: Unlimited (users own their data)

**Q: Onboarding tutorial?**
A: Yes, 3-step overlay tutorial on first login

---

**Session Duration:** 2 hours
**Output:** MVP scope locked, tech stack confirmed, next steps assigned

---

Generated with BMAD Method v6
Phase 1: Brainstorming Complete
