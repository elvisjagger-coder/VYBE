/* =========================================================
   VYBE — JavaScript commun à toutes les pages de l'application
   Sommaire :
    1. Données (musiques, artistes, genres, playlists)
    2. Sauvegarde dans le navigateur (localStorage)
    3. Chargement des fichiers JSON avec fetch()
    4. Fonctions utiles pour retrouver des données
    5. Navigation entre les pages
    6. Favoris et playlists
    7. Éléments réutilisables (icônes, cartes, lignes de musique)
    8. Interface commune (barre latérale, barre du haut, pied de page)
    9. Lecteur audio
   10. Démarrage de l'application
   ========================================================= */


/* ---------- 1. DONNÉES ---------- */

// Ces deux tableaux sont vides au départ : ils seront remplis
// avec le contenu des fichiers JSON (voir chargerDonnees()).
let musiques = [];
let artistes = [];

// Les genres musicaux et leur couleur (page Recherche)
const genres = [
    { nom: "R&B", couleur: "#a98cff" },
    { nom: "Afrobeats", couleur: "#ff986f" },
    { nom: "Electronic", couleur: "#58d2dc" },
    { nom: "Indie", couleur: "#f0c765" },
    { nom: "Hip-Hop", couleur: "#fc6ca1" },
    { nom: "Jazz", couleur: "#6f88ff" }
];

// Les 3 playlists présentes au premier lancement.
// "titres" contient les id des musiques de la playlist.
const playlistsDeDepart = [
    {
        id: "night-drive",
        titre: "Night Drive",
        description: "Les phares, les routes vides et les titres qui vous font avancer.",
        image: "../assets/images/blue.jpg",
        publique: true,
        titres: [1, 2, 3, 4, 5, 6]
    },
    {
        id: "sunday-reset",
        titre: "Sunday Reset",
        description: "Respirez. Recommencez.",
        image: "../assets/images/luna.jpg",
        publique: false,
        titres: [1, 2, 3]
    },
    {
        id: "deep-focus",
        titre: "Deep Focus",
        description: "Moins de bruit. Plus de concentration.",
        image: "../assets/images/purple.jpg",
        publique: false,
        titres: [3, 4, 5, 6]
    }
];

// Nom de la page ouverte : il est écrit dans le HTML, sur <body data-page="...">
const pageActuelle = document.body.getAttribute("data-page");


/* ---------- 2. SAUVEGARDE DANS LE NAVIGATEUR ---------- */

// localStorage est une petite mémoire du navigateur. Elle garde les données
// quand on change de page ou quand on ferme le site.
// Elle ne sait stocker que du texte : on transforme donc nos tableaux
// en texte avec JSON.stringify(), et on les retrouve avec JSON.parse().

function lireStockage(cle, valeurParDefaut) {
    const texte = localStorage.getItem(cle);

    if (texte === null) {
        return valeurParDefaut; // rien n'a encore été enregistré
    }
    return JSON.parse(texte);
}

function ecrireStockage(cle, valeur) {
    localStorage.setItem(cle, JSON.stringify(valeur));
}

// Les données personnelles de l'utilisateur
let favoris = lireStockage("vybeFavoris", [2, 4]);              // id des titres likés
let playlists = lireStockage("vybePlaylists", playlistsDeDepart);
let historique = lireStockage("vybeHistorique", [1, 3, 5]);     // id des titres écoutés
let artistesSuivis = lireStockage("vybeArtistesSuivis", ["Luna Ray", "Nova K", "Aya Sol"]);
let nomUtilisateur = lireStockage("vybeNom", "Alex Morgan");


/* ---------- 3. CHARGEMENT DES FICHIERS JSON ---------- */

// fetch() va chercher un fichier. Comme cela prend un peu de temps,
// on utilise async / await pour attendre la réponse avant de continuer.
async function chargerDonnees() {
    try {
        const reponseMusiques = await fetch("../data/musiques.json");
        musiques = await reponseMusiques.json();

        const reponseArtistes = await fetch("../data/artistes.json");
        artistes = await reponseArtistes.json();
    } catch (erreur) {
        console.error("Erreur de chargement des données :", erreur);
    }
}


/* ---------- 4. FONCTIONS UTILES ---------- */

// Retrouve une musique grâce à son id
function trouverMusique(id) {
    for (let i = 0; i < musiques.length; i++) {
        if (musiques[i].id === id) {
            return musiques[i];
        }
    }
    return null;
}

// Retrouve un artiste grâce à son nom
function trouverArtiste(nom) {
    for (let i = 0; i < artistes.length; i++) {
        if (artistes[i].nom === nom) {
            return artistes[i];
        }
    }
    return artistes[0];
}

// Retrouve une playlist grâce à son id
function trouverPlaylist(id) {
    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === id) {
            return playlists[i];
        }
    }
    return playlists[0];
}

// Transforme une liste d'id en liste de musiques
function musiquesDepuisIds(listeIds) {
    const resultat = [];

    listeIds.forEach(function (id) {
        const musique = trouverMusique(id);
        if (musique !== null) {
            resultat.push(musique);
        }
    });
    return resultat;
}

function filtrerParArtiste(nomArtiste) {
    return musiques.filter(function (musique) {
        return musique.artiste === nomArtiste;
    });
}

function filtrerParAlbum(nomAlbum) {
    return musiques.filter(function (musique) {
        return musique.album === nomAlbum;
    });
}

function filtrerParGenre(nomGenre) {
    return musiques.filter(function (musique) {
        return musique.genre === nomGenre;
    });
}

// Construit la liste des albums à partir d'une liste de musiques.
// Chaque album n'apparaît qu'une seule fois.
function listeAlbums(listeMusiques) {
    const albums = [];
    const nomsDejaVus = [];

    listeMusiques.forEach(function (musique) {
        if (!nomsDejaVus.includes(musique.album)) {
            nomsDejaVus.push(musique.album);
            albums.push({
                nom: musique.album,
                artiste: musique.artiste,
                image: musique.image,
                annee: musique.annee,
                nombreTitres: filtrerParAlbum(musique.album).length
            });
        }
    });
    return albums;
}

// Construit la liste des artistes (sans doublon) d'une liste de musiques
function listeArtistes(listeMusiques) {
    const resultat = [];
    const nomsDejaVus = [];

    listeMusiques.forEach(function (musique) {
        if (!nomsDejaVus.includes(musique.artiste)) {
            nomsDejaVus.push(musique.artiste);
            resultat.push(trouverArtiste(musique.artiste));
        }
    });
    return resultat;
}

// Écrit « 1 titre » ou « 3 titres »
function texteNombreTitres(nombre) {
    if (nombre > 1) {
        return nombre + " titres";
    }
    return nombre + " titre";
}

// Transforme des secondes en texte « 1:05 »
function formaterTemps(secondes) {
    const minutes = Math.floor(secondes / 60);
    let reste = Math.floor(secondes % 60);

    if (reste < 10) {
        reste = "0" + reste;
    }
    return minutes + ":" + reste;
}


/* ---------- 5. NAVIGATION ENTRE LES PAGES ---------- */

// Avant de changer de page, on enregistre ce que l'utilisateur a choisi.
// La page suivante lira cette information pour savoir quoi afficher.

function ouvrirArtiste(nomArtiste) {
    ecrireStockage("vybeArtisteChoisi", nomArtiste);
    window.location.href = "artiste.html";
}

function ouvrirAlbum(nomAlbum) {
    ecrireStockage("vybeAlbumChoisi", nomAlbum);
    window.location.href = "album.html";
}

function ouvrirPlaylist(idPlaylist) {
    ecrireStockage("vybePlaylistChoisie", idPlaylist);
    window.location.href = "playlist.html";
}

function ouvrirRecherche(texte) {
    ecrireStockage("vybeRecherche", texte);
    window.location.href = "recherche.html";
}

// mode = "creer" ou "modifier"
function ouvrirEditeurPlaylist(mode) {
    ecrireStockage("vybeModeEditeur", mode);
    window.location.href = "editeur-playlist.html";
}


/* ---------- 6. FAVORIS ET PLAYLISTS ---------- */

// Cette variable peut contenir une fonction à lancer quand les favoris
// changent (la page Favoris s'en sert pour se mettre à jour).
let quandFavorisChangent = null;

// Ajoute le titre aux favoris, ou le retire s'il y est déjà
function basculerFavori(idMusique) {
    if (favoris.includes(idMusique)) {
        favoris = favoris.filter(function (id) {
            return id !== idMusique;
        });
    } else {
        favoris.push(idMusique);
    }

    ecrireStockage("vybeFavoris", favoris);
    mettreAJourCoeurs();

    if (quandFavorisChangent !== null) {
        quandFavorisChangent();
    }
}

// Colore tous les cœurs de la page selon la liste des favoris.
// Chaque bouton cœur porte l'id de sa musique dans l'attribut data-coeur.
function mettreAJourCoeurs() {
    const boutons = document.querySelectorAll("[data-coeur]");

    boutons.forEach(function (bouton) {
        const id = Number(bouton.getAttribute("data-coeur"));

        if (favoris.includes(id)) {
            bouton.classList.add("aime");
        } else {
            bouton.classList.remove("aime");
        }
    });
}

function enregistrerPlaylists() {
    ecrireStockage("vybePlaylists", playlists);
}

// La playlist dans laquelle le bouton « + » ajoute les titres
function playlistChoisie() {
    const id = lireStockage("vybePlaylistChoisie", "night-drive");
    return trouverPlaylist(id);
}

function ajouterALaPlaylist(playlist, idMusique) {
    if (!playlist.titres.includes(idMusique)) {
        playlist.titres.push(idMusique);
        enregistrerPlaylists();
    }
}

function retirerDeLaPlaylist(playlist, idMusique) {
    playlist.titres = playlist.titres.filter(function (id) {
        return id !== idMusique;
    });
    enregistrerPlaylists();
}

// Place le titre en première position de l'historique d'écoute
function ajouterALHistorique(idMusique) {
    historique = historique.filter(function (id) {
        return id !== idMusique;
    });
    historique.unshift(idMusique);
    ecrireStockage("vybeHistorique", historique);
}


/* ---------- 7. ÉLÉMENTS RÉUTILISABLES ---------- */

// Renvoie le code HTML d'une icône.
// Tous les dessins sont dans assets/icones.svg ; on en choisit un par son nom.
function icone(nom, classes = "") {
    return `<svg class="icone ${classes}"><use href="../assets/icones.svg#${nom}"></use></svg>`;
}

// Crée une carte (pochette + titre + sous-titre).
// "action" est la fonction lancée quand on clique sur la carte.
function creerCarte(image, titre, sousTitre, estRonde, action) {
    const carte = document.createElement("button");
    carte.className = "carte";

    carte.innerHTML = `
        <div class="carte-image">
            <img src="${image}" alt="">
            <span class="carte-lecture">${icone("lecture", "icone-pleine")}</span>
        </div>
        <b class="carte-titre"></b>
        <span class="carte-sous-titre"></span>
    `;

    // textContent affiche le texte tel quel : c'est plus sûr que innerHTML
    // pour un texte écrit par l'utilisateur (le nom d'une playlist).
    carte.querySelector(".carte-titre").textContent = titre;
    carte.querySelector(".carte-sous-titre").textContent = sousTitre;

    if (estRonde) {
        carte.querySelector(".carte-image").classList.add("ronde");
    }

    carte.addEventListener("click", action);
    return carte;
}

// Les 3 fonctions suivantes créent une carte pour chaque type de contenu
function creerCarteAlbum(album) {
    return creerCarte(album.image, album.nom, album.artiste + " · Album", false, function () {
        ouvrirAlbum(album.nom);
    });
}

function creerCarteArtiste(artiste) {
    return creerCarte(artiste.image, artiste.nom, "Artiste", true, function () {
        ouvrirArtiste(artiste.nom);
    });
}

function creerCartePlaylist(playlist) {
    let visibilite = "Privée";
    if (playlist.publique) {
        visibilite = "Publique";
    }
    const sousTitre = visibilite + " · " + texteNombreTitres(playlist.titres.length);

    return creerCarte(playlist.image, playlist.titre, sousTitre, false, function () {
        ouvrirPlaylist(playlist.id);
    });
}

// Crée une ligne de musique : numéro, pochette, titre, album, cœur, durée, ajout
function creerLigneMusique(musique, numero) {
    const ligne = document.createElement("div");
    ligne.className = "ligne-musique";
    ligne.setAttribute("data-musique", musique.id);

    ligne.innerHTML = `
        <button class="ligne-numero" aria-label="Lire ${musique.titre}">
            <span>${numero}</span>
            ${icone("lecture", "icone-petite icone-pleine")}
        </button>
        <img src="${musique.image}" alt="">
        <div class="ligne-nom">
            <b>${musique.titre}</b>
            <span>${musique.artiste}</span>
        </div>
        <span class="ligne-album">${musique.album}</span>
        <button class="bouton-coeur" data-coeur="${musique.id}" aria-label="Ajouter aux favoris">
            ${icone("coeur")}
        </button>
        <span>${musique.duree}</span>
        <button class="bouton-ajout" aria-label="Ajouter à la playlist"></button>
    `;

    // Événement : clic sur le numéro = lire la musique
    ligne.querySelector(".ligne-numero").addEventListener("click", function () {
        lireMusique(musique);
    });

    // Événement : clic sur le cœur = ajouter / retirer des favoris
    ligne.querySelector(".bouton-coeur").addEventListener("click", function () {
        basculerFavori(musique.id);
    });

    // Bouton « + » : ajoute le titre à la playlist choisie
    const boutonAjout = ligne.querySelector(".bouton-ajout");
    const playlist = playlistChoisie();
    boutonAjout.title = "Ajouter à " + playlist.titre;

    if (playlist.titres.includes(musique.id)) {
        boutonAjout.innerHTML = icone("valide");
        boutonAjout.disabled = true;
    } else {
        boutonAjout.innerHTML = icone("plus");
    }

    boutonAjout.addEventListener("click", function () {
        ajouterALaPlaylist(playlist, musique.id);
        boutonAjout.innerHTML = icone("valide");
        boutonAjout.disabled = true;
    });

    return ligne;
}

// Affiche une liste de musiques dans un conteneur HTML
function afficherMusiques(listeMusiques, conteneur) {
    conteneur.innerHTML = "";

    for (let i = 0; i < listeMusiques.length; i++) {
        const ligne = creerLigneMusique(listeMusiques[i], i + 1);
        conteneur.appendChild(ligne);
    }

    mettreAJourCoeurs();
    surlignerMusiqueActuelle();
}

// Affiche une liste d'albums sous forme de cartes
function afficherAlbums(albums, conteneur) {
    conteneur.innerHTML = "";

    albums.forEach(function (album) {
        conteneur.appendChild(creerCarteAlbum(album));
    });
}

// Affiche une liste d'artistes sous forme de cartes rondes
function afficherArtistes(listeDesArtistes, conteneur) {
    conteneur.innerHTML = "";

    listeDesArtistes.forEach(function (artiste) {
        conteneur.appendChild(creerCarteArtiste(artiste));
    });
}


/* ---------- 8. INTERFACE COMMUNE ---------- */

// La barre latérale, la barre du haut, le pied de page et le lecteur sont
// identiques sur toutes les pages. Au lieu de recopier leur HTML dans chaque
// fichier, on les écrit une seule fois ici et JavaScript les insère.

function afficherBarreLaterale() {
    const barre = document.querySelector("#barreLaterale");

    barre.innerHTML = `
        <a href="accueil.html" class="marque marque-compacte" aria-label="Accueil VYBE">
            <img src="../assets/logo/vybe-logo.png" alt="VYBE">
        </a>
        <nav>
            <p class="menu-titre">DÉCOUVRIR</p>
            <a href="accueil.html" data-menu="accueil">${icone("accueil")} Accueil</a>
            <a href="recherche.html" data-menu="recherche">${icone("recherche")} Recherche</a>
            <a href="bibliotheque.html" data-menu="bibliotheque">${icone("bibliotheque")} Bibliothèque</a>
            <p class="menu-titre menu-collection">COLLECTION</p>
            <a href="favoris.html" data-menu="favoris">${icone("coeur")} Titres likés</a>
            <a href="playlists.html" data-menu="playlists">${icone("playlist")} Playlists</a>
            <a href="albums.html" data-menu="albums">${icone("disque")} Albums</a>
            <a href="artistes.html" data-menu="artistes">${icone("artistes")} Artistes</a>
        </nav>
        <div class="barre-playlists" id="barrePlaylists">
            <button id="boutonNouvellePlaylist">${icone("plus", "icone-petite")} Nouvelle playlist</button>
        </div>
        <a href="profil.html" class="profil-mini">
            <img src="../assets/images/nova.jpg" alt="">
            <div>
                <b class="js-nom"></b>
                <span>Votre profil</span>
            </div>
            ${icone("options")}
        </a>
    `;

    // On met en valeur le lien de la page ouverte
    const liens = barre.querySelectorAll("nav a");

    liens.forEach(function (lien) {
        const menu = lien.getAttribute("data-menu");

        if (menu === pageActuelle) {
            lien.classList.add("actif");
        } else if (menu === "bibliotheque" && pageActuelle === "historique") {
            lien.classList.add("actif");
        } else if (menu === "playlists" && (pageActuelle === "playlist" || pageActuelle === "editeur-playlist")) {
            lien.classList.add("actif");
        }
    });

    // La liste des playlists de l'utilisateur
    const zonePlaylists = barre.querySelector("#barrePlaylists");

    playlists.forEach(function (playlist) {
        const bouton = document.createElement("button");
        bouton.textContent = playlist.titre;
        bouton.addEventListener("click", function () {
            ouvrirPlaylist(playlist.id);
        });
        zonePlaylists.appendChild(bouton);
    });

    barre.querySelector("#boutonNouvellePlaylist").addEventListener("click", function () {
        ouvrirEditeurPlaylist("creer");
    });
}

function afficherBarreHaut() {
    const barre = document.querySelector("#barreHaut");

    barre.innerHTML = `
        <div class="barre-haut-logo">
            <a href="accueil.html" class="marque marque-compacte" aria-label="Accueil VYBE">
                <img src="../assets/logo/vybe-logo.png" alt="VYBE">
            </a>
        </div>
        <span class="slogan">VOTRE SON. VOTRE MONDE.</span>
        <form class="recherche-globale" id="rechercheGlobale">
            ${icone("recherche")}
            <input type="text" placeholder="Rechercher des artistes, titres, albums..." aria-label="Rechercher">
            <button type="submit" aria-label="Lancer la recherche">${icone("fleche-droite", "icone-petite")}</button>
        </form>
        <div class="actions-haut">
            <a href="parametres.html" class="bouton-icone" aria-label="Paramètres">${icone("parametres")}</a>
            <a href="profil.html" class="bouton-avatar" aria-label="Votre profil">
                <img src="../assets/images/nova.jpg" alt="">
                ${icone("chevron-bas", "icone-petite")}
            </a>
        </div>
    `;

    // Événement "submit" : l'utilisateur valide le formulaire de recherche.
    // preventDefault() empêche le navigateur de recharger la page.
    const formulaire = barre.querySelector("#rechercheGlobale");

    formulaire.addEventListener("submit", function (event) {
        event.preventDefault();
        const texte = formulaire.querySelector("input").value;
        ouvrirRecherche(texte);
    });
}

function afficherNavMobile() {
    const nav = document.querySelector("#navMobile");

    nav.innerHTML = `
        <a href="accueil.html" data-menu="accueil">${icone("accueil")}<span>Accueil</span></a>
        <a href="recherche.html" data-menu="recherche">${icone("recherche")}<span>Recherche</span></a>
        <a href="bibliotheque.html" data-menu="bibliotheque">${icone("bibliotheque")}<span>Bibliothèque</span></a>
        <a href="profil.html" data-menu="profil">${icone("profil")}<span>Vous</span></a>
    `;

    // On choisit lequel des 4 boutons doit être allumé
    let menuActif = "bibliotheque";

    if (pageActuelle === "accueil") {
        menuActif = "accueil";
    } else if (pageActuelle === "recherche" || pageActuelle === "artiste" || pageActuelle === "album") {
        menuActif = "recherche";
    } else if (pageActuelle === "profil" || pageActuelle === "parametres") {
        menuActif = "profil";
    }

    nav.querySelector(`[data-menu="${menuActif}"]`).classList.add("actif");
}

// Les textes des fenêtres d'information du pied de page
const informations = {
    apropos: {
        surtitre: "À propos de VYBE",
        titre: "Votre son. Votre monde.",
        texte: "VYBE réunit la découverte, vos artistes préférés et votre collection personnelle dans un seul espace d'écoute. Ce site est un projet étudiant réalisé en Licence 3 Chef de Projet Digital à l'ISM Dakar."
    },
    aide: {
        surtitre: "Centre d'aide",
        titre: "Un coup de main pour trouver le rythme.",
        texte: "Recherchez un titre, un artiste ou un album. Cliquez sur le cœur à côté d'un titre pour l'ajouter à vos Titres likés. Dans votre Bibliothèque, créez une playlist, ouvrez-la, puis ajoutez ou retirez des titres. Le lecteur en bas de l'écran permet de lire, mettre en pause et changer de titre."
    },
    conditions: {
        surtitre: "Conditions d'utilisation",
        titre: "À propos de ce projet.",
        texte: "VYBE est une application de démonstration et non un service de streaming commercial. Les titres, artistes et extraits audio sont des contenus de démonstration. Aucun paiement n'est demandé."
    },
    confidentialite: {
        surtitre: "Confidentialité",
        titre: "Votre vie privée compte.",
        texte: "Vos favoris, vos playlists et votre nom sont enregistrés uniquement dans votre navigateur. Rien n'est envoyé sur Internet. L'inscription et la connexion sont des démonstrations : ne saisissez pas un vrai mot de passe."
    }
};

function afficherPiedDePage() {
    const pied = document.querySelector("#piedDePage");
    const annee = new Date().getFullYear();

    pied.innerHTML = `
        <div class="pied-principal">
            <div>
                <a href="accueil.html" class="pied-logo"><img src="../assets/logo/vybe-logo.png" alt="VYBE"></a>
                <p>Une bande-son pour chaque facette de vous.<br>Trouvez votre son. Faites-le vôtre.</p>
                <div class="pied-reseaux">
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">${icone("photo")}</a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">${icone("note")}</a>
                </div>
            </div>
            <div>
                <h3>Explorer</h3>
                <a href="accueil.html">Découvrir la musique</a>
                <a href="recherche.html">Trouver votre prochain coup de cœur</a>
                <a href="bibliotheque.html">Votre bibliothèque</a>
            </div>
            <div>
                <h3>VYBE</h3>
                <button data-info="apropos">À propos de VYBE</button>
                <button data-info="aide">Centre d'aide</button>
                <a href="parametres.html">Paramètres du compte</a>
            </div>
            <div>
                <h3>Conçu pour tous les écrans</h3>
                <p>Le même VYBE, partout où vous écoutez.</p>
                <a href="connexion.html">Se connecter / Créer un compte</a>
            </div>
        </div>
        <div class="pied-bas">
            <span>© ${annee} VYBE. Tous droits réservés.</span>
            <div>
                <button data-info="conditions">Conditions d'utilisation</button>
                <button data-info="confidentialite">Confidentialité</button>
                <span>Fait pour les amoureux de la musique.</span>
            </div>
        </div>
        <dialog class="fenetre-info" id="fenetreInfo">
            <button class="fermer-fenetre" aria-label="Fermer">${icone("fermer")}</button>
            <span class="surtitre"></span>
            <h2></h2>
            <p></p>
            <button class="bouton bouton-principal">J'ai compris</button>
        </dialog>
    `;

    const fenetre = pied.querySelector("#fenetreInfo");

    // Chaque bouton data-info ouvre la fenêtre avec le bon texte
    pied.querySelectorAll("[data-info]").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            const sujet = informations[bouton.getAttribute("data-info")];

            fenetre.querySelector(".surtitre").textContent = sujet.surtitre;
            fenetre.querySelector("h2").textContent = sujet.titre;
            fenetre.querySelector("p").textContent = sujet.texte;
            fenetre.showModal(); // ouvre la balise <dialog>
        });
    });

    // Les deux boutons de la fenêtre servent à la fermer
    fenetre.querySelectorAll("button").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            fenetre.close();
        });
    });
}

// Écrit le nom de l'utilisateur partout où il apparaît (classe js-nom)
function afficherNomUtilisateur() {
    document.querySelectorAll(".js-nom").forEach(function (element) {
        element.textContent = nomUtilisateur;
    });
}

// Applique les réglages choisis dans la page Paramètres
function appliquerPreferences() {
    const html = document.documentElement; // la balise <html>

    if (lireStockage("vybeAnimationsReduites", false)) {
        html.setAttribute("data-animations", "reduites");
    } else {
        html.removeAttribute("data-animations");
    }

    if (lireStockage("vybePochettesCompactes", false)) {
        html.setAttribute("data-pochettes", "compactes");
    } else {
        html.removeAttribute("data-pochettes");
    }
}


/* ---------- 9. LECTEUR AUDIO ---------- */

// new Audio() crée un lecteur audio invisible, piloté en JavaScript
const lecteur = new Audio();
let musiqueActuelle = null;

function afficherLecteur() {
    // La barre du bas
    document.querySelector("#lecteur").innerHTML = `
        <button class="en-cours js-ouvrir-plein" aria-label="Ouvrir le lecteur">
            <img class="js-pochette" src="" alt="">
            <div>
                <b class="js-titre"></b>
                <span class="js-artiste"></span>
            </div>
        </button>
        <button class="js-coeur" data-coeur="0" aria-label="Ajouter aux favoris">${icone("coeur")}</button>
        <div class="lecteur-centre">
            <div class="lecteur-commandes">
                <button class="js-precedent" aria-label="Titre précédent">${icone("precedent", "icone-pleine")}</button>
                <button class="bouton-lecture js-lecture" aria-label="Lecture ou pause">
                    ${icone("lecture", "icone-pleine icone-lecture")}
                    ${icone("pause", "icone-pleine icone-pause")}
                </button>
                <button class="js-suivant" aria-label="Titre suivant">${icone("suivant", "icone-pleine")}</button>
            </div>
            <div class="progression">
                <span class="js-temps-actuel">0:00</span>
                <input class="barre-lecture js-progression" type="range" min="0" max="100" value="0" aria-label="Progression du titre">
                <span class="js-temps-total">0:00</span>
            </div>
        </div>
        <div class="lecteur-droite">
            ${icone("volume")}
            <input class="barre-volume" id="volume" type="range" min="0" max="100" value="65" aria-label="Volume">
            <button class="js-ouvrir-plein" aria-label="Agrandir le lecteur">${icone("agrandir")}</button>
        </div>
    `;

    // Le lecteur plein écran
    document.querySelector("#lecteurPlein").innerHTML = `
        <div class="lecteur-plein-fond"></div>
        <header>
            <span class="marque marque-compacte"><img src="../assets/logo/vybe-logo.png" alt="VYBE"></span>
            <button id="fermerPlein" aria-label="Fermer le lecteur">${icone("fermer", "icone-grande")}</button>
        </header>
        <main>
            <div class="grande-pochette">
                <div class="halo-pochette"></div>
                <img class="js-pochette" src="" alt="">
            </div>
            <div class="details-lecture">
                <span class="surtitre">EN ÉCOUTE · <span class="js-album"></span></span>
                <div class="grand-titre">
                    <div>
                        <h1 class="js-titre"></h1>
                        <button class="js-artiste" id="artistePlein"></button>
                    </div>
                    <button class="js-coeur" data-coeur="0" aria-label="Ajouter aux favoris">${icone("coeur", "icone-grande")}</button>
                </div>
                <div class="grande-progression">
                    <input class="barre-lecture js-progression" type="range" min="0" max="100" value="0" aria-label="Progression du titre">
                    <span class="js-temps-actuel">0:00</span>
                    <span class="js-temps-total">0:00</span>
                </div>
                <div class="grandes-commandes">
                    <button class="js-precedent" aria-label="Titre précédent">${icone("precedent", "icone-grande icone-pleine")}</button>
                    <button class="grand-bouton-lecture js-lecture" aria-label="Lecture ou pause">
                        ${icone("lecture", "icone-grande icone-pleine icone-lecture")}
                        ${icone("pause", "icone-grande icone-pleine icone-pause")}
                    </button>
                    <button class="js-suivant" aria-label="Titre suivant">${icone("suivant", "icone-grande icone-pleine")}</button>
                </div>
            </div>
        </main>
    `;

    brancherLecteur();
}

// Relie chaque bouton du lecteur à sa fonction.
// Les boutons existent en double (barre du bas + plein écran) :
// on utilise donc querySelectorAll() et une boucle forEach().
function brancherLecteur() {
    document.querySelectorAll(".js-lecture").forEach(function (bouton) {
        bouton.addEventListener("click", basculerLecture);
    });

    document.querySelectorAll(".js-suivant").forEach(function (bouton) {
        bouton.addEventListener("click", musiqueSuivante);
    });

    document.querySelectorAll(".js-precedent").forEach(function (bouton) {
        bouton.addEventListener("click", musiquePrecedente);
    });

    document.querySelectorAll(".js-coeur").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            basculerFavori(musiqueActuelle.id);
        });
    });

    // Barre de progression : quand on la déplace, on change le moment de lecture
    document.querySelectorAll(".js-progression").forEach(function (barre) {
        barre.addEventListener("input", function () {
            lecteur.currentTime = barre.value;
        });
    });

    // Volume : la barre va de 0 à 100, lecteur.volume va de 0 à 1
    const barreVolume = document.querySelector("#volume");
    barreVolume.value = lireStockage("vybeVolume", 65);
    lecteur.volume = barreVolume.value / 100;

    barreVolume.addEventListener("input", function () {
        lecteur.volume = barreVolume.value / 100;
        ecrireStockage("vybeVolume", Number(barreVolume.value));
    });

    // Ouvrir / fermer le lecteur plein écran
    const lecteurPlein = document.querySelector("#lecteurPlein");

    document.querySelectorAll(".js-ouvrir-plein").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            lecteurPlein.classList.add("ouvert");
        });
    });

    document.querySelector("#fermerPlein").addEventListener("click", function () {
        lecteurPlein.classList.remove("ouvert");
    });

    document.querySelector("#artistePlein").addEventListener("click", function () {
        ouvrirArtiste(musiqueActuelle.artiste);
    });
}

// Prépare une musique dans le lecteur (sans la lancer)
function chargerMusique(musique) {
    musiqueActuelle = musique;
    lecteur.src = musique.audio;
    ecrireStockage("vybeMusiqueActuelle", musique.id);

    // On affiche ses informations dans la barre du bas et le plein écran
    document.querySelectorAll(".js-titre").forEach(function (element) {
        element.textContent = musique.titre;
    });
    document.querySelectorAll(".js-artiste").forEach(function (element) {
        element.textContent = musique.artiste;
    });
    document.querySelectorAll(".js-pochette").forEach(function (image) {
        image.src = musique.image;
    });
    document.querySelectorAll(".js-coeur").forEach(function (bouton) {
        bouton.setAttribute("data-coeur", musique.id);
    });
    document.querySelector(".js-album").textContent = musique.album;
    document.querySelector(".lecteur-plein-fond").style.backgroundImage = `url(${musique.image})`;

    mettreAJourCoeurs();
    surlignerMusiqueActuelle();
}

// Lance la lecture. play() peut être refusé par le navigateur
// (par exemple si l'utilisateur n'a encore cliqué nulle part) :
// try / catch évite alors une erreur dans la console.
async function demarrerLecture() {
    try {
        await lecteur.play();
    } catch (erreur) {
        document.body.classList.remove("en-lecture");
    }
}

// Lit la musique demandée
function lireMusique(musique) {
    if (musiqueActuelle === null || musiqueActuelle.id !== musique.id) {
        chargerMusique(musique);
    }
    demarrerLecture();
    ajouterALHistorique(musique.id);
}

function mettreEnPause() {
    lecteur.pause();
}

// Bouton lecture / pause
function basculerLecture() {
    if (lecteur.paused) {
        lireMusique(musiqueActuelle);
    } else {
        mettreEnPause();
    }
}

// Position de la musique actuelle dans le tableau "musiques"
function indexMusiqueActuelle() {
    for (let i = 0; i < musiques.length; i++) {
        if (musiques[i].id === musiqueActuelle.id) {
            return i;
        }
    }
    return 0;
}

function musiqueSuivante() {
    let index = indexMusiqueActuelle() + 1;

    if (index >= musiques.length) {
        index = 0; // après la dernière, on revient à la première
    }
    lireMusique(musiques[index]);
}

function musiquePrecedente() {
    let index = indexMusiqueActuelle() - 1;

    if (index < 0) {
        index = musiques.length - 1; // avant la première, on va à la dernière
    }
    lireMusique(musiques[index]);
}

// Met en valeur, dans les listes, la ligne de la musique chargée
function surlignerMusiqueActuelle() {
    document.querySelectorAll(".ligne-musique").forEach(function (ligne) {
        const id = Number(ligne.getAttribute("data-musique"));

        if (musiqueActuelle !== null && id === musiqueActuelle.id) {
            ligne.classList.add("en-cours-de-lecture");
        } else {
            ligne.classList.remove("en-cours-de-lecture");
        }
    });
}

// --- Événements envoyés par le lecteur audio ---

// "timeupdate" : envoyé plusieurs fois par seconde pendant la lecture.
// On s'en sert pour faire avancer la barre de progression.
lecteur.addEventListener("timeupdate", function () {
    document.querySelectorAll(".js-progression").forEach(function (barre) {
        barre.value = lecteur.currentTime;
    });
    document.querySelectorAll(".js-temps-actuel").forEach(function (element) {
        element.textContent = formaterTemps(lecteur.currentTime);
    });
    ecrireStockage("vybePosition", lecteur.currentTime);
});

// "loadedmetadata" : le navigateur connaît maintenant la durée du fichier
lecteur.addEventListener("loadedmetadata", function () {
    document.querySelectorAll(".js-progression").forEach(function (barre) {
        barre.max = lecteur.duration;
    });
    document.querySelectorAll(".js-temps-total").forEach(function (element) {
        element.textContent = formaterTemps(lecteur.duration);
    });
});

// "play" et "pause" : on change l'icône du bouton grâce à une classe sur <body>
lecteur.addEventListener("play", function () {
    document.body.classList.add("en-lecture");
    ecrireStockage("vybeEnLecture", true);
});

lecteur.addEventListener("pause", function () {
    document.body.classList.remove("en-lecture");
    ecrireStockage("vybeEnLecture", false);
});

// "ended" : la musique est terminée, on passe à la suivante
lecteur.addEventListener("ended", musiqueSuivante);

// Au chargement d'une page, on remet la musique là où elle en était.
// C'est ce qui permet de continuer l'écoute en changeant de page.
function restaurerLecteur() {
    const idSauvegarde = lireStockage("vybeMusiqueActuelle", 1);
    const position = lireStockage("vybePosition", 0);
    const etaitEnLecture = lireStockage("vybeEnLecture", false);
    let musique = trouverMusique(idSauvegarde);

    if (musique === null) {
        musique = musiques[0];
    }

    chargerMusique(musique);
    lecteur.currentTime = position;

    if (etaitEnLecture) {
        demarrerLecture();
    }
}


/* ---------- 10. DÉMARRAGE DE L'APPLICATION ---------- */

// Chaque page appelle cette fonction en lui donnant sa propre fonction
// d'affichage. L'ordre est important : on attend d'abord les données,
// puis on construit l'interface commune, puis le contenu de la page.
async function demarrerApplication(afficherPage) {
    appliquerPreferences();

    await chargerDonnees();

    afficherBarreLaterale();
    afficherBarreHaut();
    afficherNavMobile();
    afficherPiedDePage();
    afficherLecteur();
    restaurerLecteur();

    afficherPage();

    afficherNomUtilisateur();
    mettreAJourCoeurs();
}
