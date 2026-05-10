# Apex Backend NOTES

## gnrl tech stack for bkend 
Node.js + Express + MongoDB backend for the Apex career navigation platform.

## Quick Start instructions 

### 1. Install dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Set up environment variables
Copy `.env.example` to `.env` and fill in your values:
\`\`\`bash
cp ../.env.example ../.env
\`\`\`

You'll need:
- A MongoDB Atlas connection string (`MONGODB_URI`)
- A port (default 3000)

### 3. Run the server
\`\`\`bash
# Production-style
npm start

# Development (auto-reloads on changes)
npm run dev
\`\`\`

### 4. Verify it's working
- Vist `http://localhost:3000` ===> should see "Hello from Apex backend!"
- Visit `http://localhost:3000/health` => should see status JSON 

## Folder Structure

| Folder | Purpose |
|---|---|
| `config/` | Database connection, OAuth setup |
| `models/` | Mongoose schemas (data shape) |
| `routes/` | API endpoints (`/api/auth`, `/api/courses`, etc.) |
| `controllers/` | Business logic for each route |
| `middleware/` | Auth, security, role checks |
| `services/` | External integrations (AI, matching algorithm) |
| `utils/` | Helper functions, validators |
| `seed/` | Scripts to populate the database |

## Request Flow

\`\`\`
Browser ==> Route ==> Middleware => Controller ==> Service/Model => MongoDB ==> Response
\`\`\`

## tech stack

- **Node.js** + **Express** — server framework
- **MongoDB Atlas** + **Mongoose** — cloud database + ODM
- **bcrypt** — for password hashing
- **jsonwebtoken** — auth tokens
- **Passport.js** — for Google OAuth

## common issues i ran into 

**"MongoDB connection error: bad auth"**
→ Check `MONGODB_URI` password in `.env`

**"injected env (0) from .env"**
→ `.env` file is missing or in the wrong directory. Should be at repo root or inside `backend/`.

**"Cannot find module 'X'"**
→ Run `npm install` from the `backend/` folder.