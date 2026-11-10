# VYBE — Application musicale

Projet pratique JavaScript — Licence 3 Chef de Projet Digital, ISM Dakar (2026-2027).

VYBE est une plateforme de découverte et d'écoute de musique réalisée en **HTML5, CSS3 et JavaScript natif**, sans framework ni bibliothèque. Elle reproduit notre maquette Figma.

## Structure du projet

```
VYBE/
├── index.html                  Page de bienvenue
├── css/
│   └── style.css               Tout le design + le responsive
├── js/
│   ├── script.js               Code commun : données, lecteur, menus, cartes
│   ├── accueil.js              Un petit fichier par page
│   ├── recherche.js
│   ├── artiste.js
│   ├── album.js
│   ├── bibliotheque.js
│   ├── collection.js           Favoris, albums, artistes, historique
│   ├── playlists.js
│   ├── playlist.js
│   ├── editeur-playlist.js
│   ├── profil.js
│   ├── parametres.js
│   └── auth.js                 Connexion, inscription, mot de passe oublié
├── pages/                      Les 17 pages de l'application
├── data/
│   ├── musiques.json           La liste des musiques
│   └── artistes.json           La liste des artistes
└── assets/
    ├── images/                 Pochettes et photos de la maquette
    ├── logo/                   Logo VYBE et favicon
    ├── music/                  Morceaux de démonstration (MP3)
    └── icones.svg              Toutes les icônes
```

## Lancer le projet

Le projet charge ses données avec `fetch()`. Il faut donc l'ouvrir avec un **serveur local** : un double-clic sur `index.html` ne suffit pas.

1. Ouvrir le dossier `VYBE` dans Visual Studio Code (Fichier > Ouvrir le dossier).
2. Installer l'extension **Live Server** (onglet Extensions).
3. Clic droit sur `index.html` > **Open with Live Server**.

## Fonctionnalités à tester

| Fonctionnalité | Où la tester |
| --- | --- |
| Liste de musiques chargée depuis le JSON | Accueil, Recherche, Album |
| Pochettes, albums, artistes, genres | Accueil, Albums, Artistes, Recherche |
| Recherche par titre, artiste ou album | Page Recherche ou barre du haut |
| Filtre par genre | Page Recherche > « Parcourir par genre » |
| Lecture, pause, suivant, précédent | Lecteur en bas de l'écran |
| Durée et barre de progression | Lecteur en bas et lecteur plein écran |
| Favoris | Cœur à côté d'un titre, puis « Titres likés » |
| Playlists : créer, modifier, supprimer, ajouter et retirer des titres | Page Playlists |
| Profil et paramètres | Avatar en haut à droite |
| Responsive | Réduire la fenêtre, ou F12 puis l'icône téléphone |

Pour vérifier qu'il n'y a pas d'erreur : touche **F12**, onglet **Console**.

Pour remettre l'application à zéro (favoris, playlists, nom) : F12 > Application > Local Storage > clic droit > Clear.

## Remplacer les morceaux de démonstration

Les fichiers de `assets/music/` sont de courts morceaux de démonstration (environ 25 secondes) créés pour le projet.

1. Copier vos fichiers MP3 dans `assets/music/`.
2. Dans `data/musiques.json`, modifier `audio` (chemin du fichier) et `duree`.

Pour ajouter une musique, copier un bloc `{ ... }` dans `musiques.json` et lui donner un nouvel `id`.

Les chemins du JSON commencent par `../` car ils sont lus depuis les pages du dossier `pages/`.

## Notions utilisées

- **Variables** : `let` et `const`.
- **DOM** : `querySelector`, `querySelectorAll`, `textContent`, `innerHTML`, `classList`, `createElement`, `appendChild`.
- **Événements** : `addEventListener` avec `click`, `input`, `change`, `submit`, et `event.preventDefault()`.
- **Conditions** : `if`, `else if`, `else`, opérateurs `===`, `&&`, `||`, `!`.
- **Tableaux et objets** : `push`, `unshift`, `includes`, `filter`, `forEach`, boucles `for`.
- **Fonctions** : `afficherMusiques()`, `afficherAlbums()`, `rechercherMusique()`, `filtrerParArtiste()`, `lireMusique()`...
- **JSON** : `fetch()`, `async` / `await`, `JSON.parse()`, `JSON.stringify()`.
- **Audio HTML5** : `new Audio()`, `play()`, `pause()`, `currentTime`, `duration`.

Notions en plus du cours, expliquées en commentaire dans le code :

- **`localStorage`** : la mémoire du navigateur. Elle garde les favoris, les playlists et la musique en cours quand on change de page.
- **`sort()`** et **`localeCompare()`** : pour trier une liste.
- **`<dialog>`** et **`showModal()`** : la fenêtre d'information du pied de page.

## Déployer sur Vercel

1. Créer un compte sur [github.com](https://github.com) et un nouveau dépôt (repository) nommé `vybe`.
2. Y envoyer tout le contenu du dossier `VYBE` (bouton « Add file > Upload files », ou GitHub Desktop).
3. Aller sur [vercel.com](https://vercel.com) et se connecter avec GitHub.
4. Cliquer sur **Add New > Project**, choisir le dépôt `vybe`, puis **Deploy**. Aucun réglage n'est nécessaire : c'est un site statique.
5. Copier le lien obtenu (par exemple `https://vybe.vercel.app`) dans le Google Sheets du professeur, avec le nom du projet et le lien Figma.

`index.html` doit rester à la racine du dépôt, sinon Vercel affiche une erreur 404.
