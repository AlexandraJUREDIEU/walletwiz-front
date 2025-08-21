# WalletWiz — Frontend (MVP)

Application budgétaire : revenus, charges fixes, répartition (Vital, Voiture, Loisirs, Épargne), budgets mensuels et transactions.

## ⚙️ Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state, persistance localStorage pour MVP)
- React Router
- ESLint

## 🚀 Démarrage
```bash
npm i        # ou npm i / yarn
cp .env.example .env.local
npm run dev      # http://localhost:5173
```

## 🔑 Variables d’environnement (Vite)

`VITE_API_URL` : URL de l’API NestJS
`VITE_APP_NAME` : nom de l’app (titre, toasts…)
`VITE_I18N_DEFAULT_LOCALE` : langue par défaut (ex: fr)
`VITE_I18N_FALLBACK_LOCALE` : langue fallback (ex: en)

## 📂 Structure (extrait)
```
src/
  components/
  lib/
    api/           # client http, interceptors (à venir J0)
  pages/
  stores/
  layouts/         # AppLayout, AuthLayout (à venir J0)
  routes/          # guards (à venir J0)
```

## 📜 Scripts

`npm dev` : serveur dev
`npm build` : build production
`npm preview` : prévisualisation
`npm lint` : lint

## 🧭 Roadmap MVP (validée)

- J0–J3: socle, auth, sessions, routes
- J4 Banks → J5 Members → J6 Incomes → J7 Expenses
- J8 Budgets (summary) → J9 Transactions → J10 Dashboard
- J11 Profil → J12 Finitions → J13 Tests → J14 CI/CD

## 🧱 Conventions

**Branches**: main (prod), dev (intégration), feat/*
**Commits**: Conventional Commits (ex: chore(init): base app)
**Qualité**: ESLint (et Prettier si configuré) 

---

## 🔮 Prochaines étapes (J0)

1. Client API (src/lib/api/client.ts) avec interceptors JWT et 401
2. AuthGuard / PublicRoute + routes
3. Layouts : AppLayout (sidebar+header), AuthLayout
4. Toaster global + loader
5. Store auth minimal (Zustand)
6. i18n fr/en