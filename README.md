# Interface client pour l'API de gestion de livres

Application web React/TypeScript développée en TP, constituant le front-end d'une API REST de gestion de livres et d'auteurs réalisée en cours de développement web.

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/AmbreRoise/ClientWebAPI.git
cd ClientWebAPI
```

### 2. Installer les dépendances

```bash
cd ClientWeb
bun install
```

### 3. Lancer l'API
Voir le [le mode d'emploi de l'API](api.md).

### 4. Lancer le client

> *Revenir à la racine du dépôt pour la suite.*

```bash
cd ClientWeb
bun run dev
```

---

## Prérequis

- L'API de gestion de livres lancée localement — par défaut sur `http://localhost:3000`

---

## Structure du projet

```
src/
├── api.ts                  # Fonctions d'appel à l'API (fetch)
├── types.ts                # Types TypeScript (Author, Book, Tag…)
├── main.tsx                # Point d'entrée, déclaration des routes
├── index.css               # Styles globaux
├── routes/
│   ├── root.tsx            # Layout principal avec navigation
│   ├── authors.tsx         # Liste paginée des auteurs
│   ├── author.tsx          # Détail d'un auteur + ses livres
│   ├── books.tsx           # Liste paginée des livres
│   └── book.tsx            # Détail d'un livre + ses tags
└── utils/
    ├── pagination.tsx      # Composant de pagination réutilisable
    └── editableText.tsx    # Composant d'édition inline (3 états)
```

---

## Fonctionnalités

### Auteurs (`/authors`)
- Liste paginée des auteurs avec filtrage par nom
- Ajout d'un auteur via formulaire (prénom + nom)
- Suppression d'un auteur
- Modification du nom via le composant `EditableText`
- Affichage du détail d'un auteur dans un panneau latéral (`/authors/:id`)

### Livres d'un auteur
- Liste des livres associés à l'auteur courant
- Ajout et suppression d'un livre depuis la fiche auteur
- Liens vers la fiche détail de chaque livre

### Livres (`/books`)
- Liste paginée des livres avec filtrage par titre
- Navigation vers la fiche détail d'un livre (`/books/:id`)
- Lien vers la fiche de l'auteur du livre

### Tags d'un livre
- Affichage des tags associés sous forme de badges
- Ajout d'un tag via un `<select>` alimenté par la liste complète des tags
- Suppression d'un tag

### Composant `EditableText`
Composant générique à trois états :
- **Display** — affiche la valeur avec un bouton d'édition
- **Editing** — champ texte avec boutons valider / annuler
- **Saving** — attente de la réponse de l'API (bouton désactivé)

### Pagination
Composant `Pagination` réutilisable avec boutons précédent/suivant désactivés aux bornes, et affichage `Page X / Y`.

### Gestion des états de chargement
Chaque composant expose un état `loading` qui affiche un placeholder pendant les requêtes, sans masquer les formulaires ni bloquer les autres composants.

### Gestion des erreurs
Les erreurs retournées par l'API sont affichées dans l'interface sous les formulaires concernés.

---

## Architecture — Séparation des responsabilités

```
Composant React
    │
    ├── state : données, pagination, filtre, loading, erreur
    ├── effect : déclenche le chargement initial (et à chaque dépendance)
    ├── fonctions métier : loadX(), addX(), removeX(), updateX()
    └── handlers : handleAdd(), handleRemove(), handleFilter()
              │
              ▼
         src/api.ts          ← seul fichier qui connaît l'URL de l'API
              │
              ▼
         fetch() + API REST
```

`src/api.ts` est le seul module ayant connaissance des routes de l'API et de son adresse. Tout le reste du code consomme ses fonctions exportées.

---

## Auteur

Projet réalisé dans le cadre du BUT Informatique — cours de développement web.
