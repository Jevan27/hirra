# Hirra - Full-Stack Vite & Node Application

A clean, modern full-stack web application structure with a Vite React frontend and a Node.js/Express backend, configured with npm workspaces and concurrent dev servers.

---

## 📁 Project Structure

```
hirra/
├── backend/
│   ├── src/
│   │   └── server.js          # Express REST API
│   ├── .env                   # Backend environment configuration
│   └── package.json           # Backend dependencies & scripts
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main dashboard component
│   │   ├── App.css
│   │   ├── index.css          # Design system & theme tokens
│   │   └── main.jsx           # React DOM root
│   ├── index.html             # HTML entry point with Google Fonts
│   ├── vite.config.js         # Vite configuration with API proxy
│   └── package.json           # Frontend dependencies & scripts
├── .gitignore
├── package.json               # Monorepo root scripts & workspaces
└── README.md
```

---

## 🚀 Quick Start

### 1. Install all dependencies
Run this at the root `hirra` folder:
```bash
npm install
```

### 2. Start development servers
Run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 🛠 Available Scripts (Root Folder)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts both backend and frontend concurrently in development mode |
| `npm run dev:frontend` | Starts only the Vite frontend dev server |
| `npm run dev:backend` | Starts only the Node/Express backend server |
| `npm run build` | Builds the frontend production bundle into `frontend/dist` |
| `npm run install:all` | Installs all root and workspace dependencies |

---

## 🌐 API Endpoints

- `GET /api/health` - Server health status and uptime
- `GET /api/info` - API information and endpoint registry
- `GET /api/greeting?name=YourName` - Sample parameterized greeting endpoint
