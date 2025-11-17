# SmartBudget - Simple Personal Finance Management

![Status](https://img.shields.io/badge/status-MVP-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**SmartBudget** is a modern, simple personal finance web application focused on **manual expense tracking** without the complexity of feature-heavy competitors.

## Tech Stack

- **Frontend:** React 18.3.1 + TypeScript 5.x + Material-UI 5.x + Recharts 2.x
- **Backend:** Node.js 20.x LTS + Express 4.x + TypeScript 5.x
- **Database:** PostgreSQL 15
- **Deployment:** Heroku + GitHub Actions CI/CD
- **Testing:** Jest, Supertest, Playwright (80% coverage target)

## Features (MVP)

- User authentication (email/password, JWT)
- Manual transaction entry (6 categories)
- Monthly budget tracking with alerts
- Visual dashboard with spending breakdown
- Transaction history with filtering

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- PostgreSQL 15
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/smartbudget.git
   cd smartbudget
   ```

2. **Set up environment variables:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up database:**
   ```bash
   # Create PostgreSQL database
   createdb smartbudget

   # Run migrations
   cd backend
   psql -d smartbudget -f migrations/001_create_users_table.sql
   psql -d smartbudget -f migrations/002_create_transactions_table.sql
   psql -d smartbudget -f migrations/003_create_budget_limits_table.sql
   ```

5. **Run the application:**
   ```bash
   # Backend (terminal 1)
   cd backend
   npm run dev

   # Frontend (terminal 2)
   cd frontend
   npm start
   ```

6. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Docker Setup (Alternative)

```bash
# Start all services (frontend, backend, database)
docker-compose up

# Access the app at http://localhost:3000
```

## Project Structure

```
smartbudget/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Context API (AuthContext)
│   │   ├── pages/           # Page components
│   │   ├── App.tsx
│   │   └── theme.ts         # Material-UI theme
│   ├── package.json
│   └── tsconfig.json
├── backend/                 # Express backend
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Logger, helpers
│   │   └── server.ts
│   ├── migrations/          # SQL migration scripts
│   ├── package.json
│   └── tsconfig.json
├── bmad_docs/              # Complete BMAD documentation
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get monthly summary

### Budgets
- `GET /api/budgets` - Get budget limits
- `POST /api/budgets` - Set budget limit
- `GET /api/budgets/alerts` - Get budget alerts (80%+ spending)

## Categories (MVP)

- Income
- Salary
- Rent
- Transport
- Groceries
- Others

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Coverage report
npm test:coverage
```

## Deployment

### Heroku (Recommended for MVP)

```bash
# Login to Heroku
heroku login

# Create app
heroku create smartbudget-staging

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file

## Team

Built with BMAD Method v6 using custom agent collaboration:

- Plamena (Product Manager)
- Aneliya (Analyst)
- Arhinna (Architect)
- Deva (Developer)
- Iulia (UX Designer)
- Silvia (Scrum Master)
- Kalina (QA Engineer)
- Darina (DevOps)

## Documentation

Complete project documentation is available in [`bmad_docs/`](bmad_docs/):

- [Execution Summary](bmad_docs/00-EXECUTION-SUMMARY.md)
- [Product Brief](bmad_docs/planner/03-PRODUCT-BRIEF.md)
- [Technical Architecture](bmad_docs/architect/05-TECHNICAL-ARCHITECTURE.md)
- [Research Report](bmad_docs/analyst/04-RESEARCH-REPORT.md)

## Roadmap

**Phase 1 (MVP - 8 weeks):** ✅ Current
- Core features: Auth, Transactions, Budgets, Dashboard

**Phase 2 (Months 4-6):**
- Bank sync (Plaid API)
- AI budget suggestions
- Export reports (PDF/CSV)
- Premium tier (€7.99/month)

**Phase 3 (Months 7-12):**
- Multi-currency support
- Shared budgets
- Recurring transactions
- Mobile app (React Native)

## Support

For questions or issues, contact the team or open an issue on GitHub.

---

**Status:** 🟢 GREEN - Ready for Implementation
**Generated with BMAD Method v6**
