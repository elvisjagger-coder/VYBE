/* =========================================================
   VYBE — Page de recherche
   Recherche par titre, artiste ou album + filtre par genre
   ========================================================= */

const champRecherche = document.querySelector("#recherche");

let resultatsActuels = [];   // les musiques trouvées
let categorie = "tout";      // l'onglet choisi : tout, titres, artistes ou albums

// Recherche les musiques dont le titre, l'artiste ou l'album contient le texte
function rechercherMusique(texte) {
    // toLowerCase() met tout en minuscules : « LUNA » trouve « Luna »
    const texteCherche = texte.toLowerCase().trim();

    if (texteCherche === "") {
        afficherSuggestions();
        return;
    }

    resultatsActuels = musiques.filter(function (musique) {
        return musique.titre.toLowerCase().includes(texteCherche)
            || musique.artiste.toLowerCase().includes(texteCherche)
            || musique.album.toLowerCase().includes(texteCherche);
    });

    document.querySelector("#surtitreRecherche").textContent = "Résultats de recherche";
    document.querySelector("#titreRecherche").textContent = "« " + texte + " »";
    afficherResultats();
}

// Affiche toutes les musiques d'un genre
function rechercherParGenre(nomGenre) {
    resultatsActuels = filtrerParGenre(nomGenre);

    document.querySelector("#surtitreRecherche").textContent = "Genre musical";
    document.querySelector("#titreRecherche").textContent = nomGenre;
    afficherResultats();
}

// Revient à l'écran de départ (recherches populaires + genres)
function afficherSuggestions() {
    document.querySelector("#surtitreRecherche").textContent = "Trouvez votre prochain coup de cœur";
    document.querySelector("#titreRecherche").textContent = "Recherche";
    document.querySelector("#suggestions").classList.remove("cache");
    document.querySelector("#resultats").classList.add("cache");
}

// Affiche les résultats selon l'onglet choisi
function afficherResultats() {
    const blocTitres = document.querySelector("#blocTitres");
    const blocArtistes = document.querySelector("#blocArtistes");
    const blocAlbums = document.querySelector("#blocAlbums");
    const aucunResultat = document.querySelector("#aucunResultat");

    document.querySelector("#suggestions").classList.add("cache");
    document.querySelector("#resultats").classList.remove("cache");

    // Cas 1 : rien trouvé
    if (resultatsActuels.length === 0) {
        aucunResultat.classList.remove("cache");
        blocTitres.classList.add("cache");
        blocArtistes.classList.add("cache");
        blocAlbums.classList.add("cache");
        return;
    }

    // Cas 2 : on remplit les trois blocs
    aucunResultat.classList.add("cache");

    afficherMeilleurResultat(resultatsActuels[0]);
    afficherMusiques(resultatsActuels, document.querySelector("#listeTitres"));
    afficherArtistes(listeArtistes(resultatsActuels), document.querySelector("#listeArtistes"));
    afficherAlbums(listeAlbums(resultatsActuels), document.querySelector("#listeAlbums"));

    // Puis on montre seulement les blocs de l'onglet choisi
    blocTitres.classList.add("cache");
    blocArtistes.classList.add("cache");
    blocAlbums.classList.add("cache");

    if (categorie === "tout" || categorie === "titres") {
        blocTitres.classList.remove("cache");
    }
    if (categorie === "tout" || categorie === "artistes") {
        blocArtistes.classList.remove("cache");
    }
    if (categorie === "tout" || categorie === "albums") {
        blocAlbums.classList.remove("cache");
    }
}

// La grande carte « meilleur résultat » : l'artiste du premier titre trouvé
function afficherMeilleurResultat(musique) {
    const artiste = trouverArtiste(musique.artiste);
    const carte = document.querySelector("#meilleurResultat");

    carte.innerHTML = `
        <span>MEILLEUR RÉSULTAT</span>
        <img src="${artiste.image}" alt="">
        <h2>${artiste.nom}</h2>
        <p>Artiste · ${artiste.auditeurs} d'auditeurs mensuels</p>
        <i>${icone("lecture", "icone-grande icone-pleine")}</i>
    `;

    // onclick remplace l'ancienne action à chaque nouvelle recherche
    carte.onclick = function () {
        ouvrirArtiste(artiste.nom);
    };
}

// Les recherches populaires
function afficherRecherchesPopulaires() {
    const conteneur = document.querySelector("#recherchesPopulaires");
    const populaires = ["Luna Ray", "Afterglow", "Nova K", "Midnight Echoes", "Blue Hours"];

    populaires.forEach(function (texte, index) {
        const bouton = document.createElement("button");

        bouton.innerHTML = `
            <b>0${index + 1}</b>
            <span>${texte}</span>
            ${icone("fleche-droite")}
        `;

        bouton.addEventListener("click", function () {
            champRecherche.value = texte;
            rechercherMusique(texte);
        });

        conteneur.appendChild(bouton);
    });
}

// Les cartes de genres musicaux
function afficherGenres() {
    const conteneur = document.querySelector("#grilleGenres");

    genres.forEach(function (genre) {
        const bouton = document.createElement("button");
        const nombre = filtrerParGenre(genre.nom).length;

        // On mélange la couleur du genre avec le fond sombre
        bouton.style.background = `color-mix(in srgb, ${genre.couleur} 35%, #11101a)`;

        bouton.innerHTML = `
            <span>${genre.nom}</span>
            <small>${texteNombreTitres(nombre)}</small>
            ${icone("disque")}
        `;

        bouton.addEventListener("click", function () {
            rechercherParGenre(genre.nom);
        });

        conteneur.appendChild(bouton);
    });
}

// Fonction principale de la page
function afficherPage() {
    afficherRecherchesPopulaires();
    afficherGenres();

    // Événement "input" : se déclenche à chaque lettre tapée
    champRecherche.addEventListener("input", function () {
        rechercherMusique(champRecherche.value);
    });

    // Les onglets Tout / Titres / Artistes / Albums
    const onglets = document.querySelectorAll("#onglets button");

    onglets.forEach(function (onglet) {
        onglet.addEventListener("click", function () {
            onglets.forEach(function (autre) {
                autre.classList.remove("actif");
            });
            onglet.classList.add("actif");

            categorie = onglet.getAttribute("data-categorie");
            afficherResultats();
        });
    });

    // Si on arrive depuis la barre de recherche du haut,
    // le texte tapé a été enregistré : on lance la recherche tout de suite.
    const texteEnAttente = lireStockage("vybeRecherche", "");

    if (texteEnAttente !== "") {
        champRecherche.value = texteEnAttente;
        rechercherMusique(texteEnAttente);
        ecrireStockage("vybeRecherche", ""); // on vide pour la prochaine visite
    }

    champRecherche.focus();
}

demarrerApplication(afficherPage);
