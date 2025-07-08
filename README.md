# 💸 WalletWiz - Frontend

**WalletWiz** est une application budgétaire permettant à l’utilisateur de saisir ses revenus et charges fixes, puis de répartir automatiquement le reste de son budget dans plusieurs catégories personnalisables :
- 🛒 Vital (alimentaire, médical…)
- 🚗 Voiture (essence, parking, péages…)
- 🎉 Loisirs (sorties, restaurants, shopping…)
- 💰 Épargne (trésorerie, projets, vacances…)

Ce dépôt contient le **frontend** du projet, développé avec **React**, **TypeScript**, **Vite**, **Tailwind CSS** et **shadcn/ui**.

---

## ⚙️ Stack technique

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) – Gestion d’état

---

## 🚀 Démarrage rapide

### 1. Cloner le repo

```bash
git clone https://github.com/AlexandraJUREDIEU/walletwiz-front.git
cd walletwiz-front
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le projet en dev

```bash
npm run dev
```

---

## 🌱 Structure du projet

```bash
walletwiz-front/
├── public/             # Fichiers statiques
├── src/
│   ├── components/     # Composants réutilisables (UI)
│   ├── pages/          # Pages principales (accueil, dashboard, etc.)
│   ├── state/          # Stores Zustand (état global)
│   ├── styles/         # Fichiers CSS/Tailwind personnalisés
│   ├── App.tsx         # App principale
│   └── main.tsx        # Point d'entrée Vite
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠 En cours de développement

* [ ] Setup complet Tailwind + shadcn/ui
* [ ] Mise en place du design système
* [ ] Routing des pages (React Router)
* [ ] Création du store global avec Zustand
* [ ] Connexion au backend (NestJS)
* [ ] Responsive & accessibilité

---

## 📦 Commandes utiles

```bash
npm run dev       # Lancer en mode développement
npm run build     # Build de production
npm run preview   # Prévisualisation du build
```

---

## ✍️ Auteure

Développé par [Alexandra JUREDIEU](https://www.linkedin.com/in/alexandra-theuleau-803b4918a/)
Projet open-source pour une gestion budgétaire simple, claire et efficace.

---

## 📝 Licence

Ce projet est sous licence [MIT](./LICENSE).

