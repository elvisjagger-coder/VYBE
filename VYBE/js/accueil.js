/* =========================================================
   VYBE — Page d'accueil
   ========================================================= */

// Choisit « Bonjour » ou « Bonsoir » selon l'heure, et ajoute le prénom
function afficherSalutation() {
    const heure = new Date().getHours();
    const prenom = nomUtilisateur.split(" ")[0]; // premier mot du nom
    let salutation = "Bonsoir";

    if (heure >= 5 && heure < 18) {
        salutation = "Bonjour";
    }

    document.querySelector("#texteSalutation").textContent = salutation + ", " + prenom;
}

// Les 4 petites cartes « recommandations du jour »
function afficherRecommandations() {
    const conteneur = document.querySelector("#recommandations");

    for (let i = 0; i < 4; i++) {
        const musique = musiques[i];
        const carte = document.createElement("button");
        carte.className = "carte-rapide";

        // La première carte a un texte spécial, comme dans la maquette
        let titre = musique.titre;
        let sousTitre = musique.artiste;

        if (i === 0) {
            titre = "Votre VYBE du jour";
            sousTitre = "Une sélection faite pour vous";
        }

        carte.innerHTML = `
            <img src="${musique.image}" alt="">
            <div>
                <b>${titre}</b>
                <span>${sousTitre}</span>
            </div>
            ${icone("lecture", "icone-pleine")}
        `;

        carte.addEventListener("click", function () {
            lireMusique(musique);
        });

        conteneur.appendChild(carte);
    }
}

// Les titres écoutés récemment (un clic lance la lecture)
function afficherEcoutesRecentes() {
    const conteneur = document.querySelector("#ecoutesRecentes");
    const titresRecents = musiquesDepuisIds(historique);

    titresRecents.forEach(function (musique) {
        const carte = creerCarte(musique.image, musique.titre, musique.artiste, false, function () {
            lireMusique(musique);
        });
        conteneur.appendChild(carte);
    });
}

// Les grandes cartes de playlists
function afficherPlaylistsVedettes() {
    const conteneur = document.querySelector("#playlistsVedettes");

    // On montre au maximum 3 playlists
    for (let i = 0; i < playlists.length && i < 3; i++) {
        const playlist = playlists[i];
        const carte = document.createElement("button");
        carte.className = "carte-editoriale";

        carte.innerHTML = `
            <img src="${playlist.image}" alt="">
            <div>
                <span class="surtitre">Sélection VYBE</span>
                <h3></h3>
                <p></p>
            </div>
            <span class="editoriale-lecture">${icone("lecture", "icone-pleine")}</span>
        `;
        carte.querySelector("h3").textContent = playlist.titre;
        carte.querySelector("p").textContent = playlist.description;

        carte.addEventListener("click", function () {
            ouvrirPlaylist(playlist.id);
        });

        conteneur.appendChild(carte);
    }
}

// Les nouveautés : les albums les plus récents d'abord
function afficherNouveautes() {
    const conteneur = document.querySelector("#nouveautes");
    const albums = listeAlbums(musiques);

    // sort() range le tableau : ici de l'année la plus grande à la plus petite
    albums.sort(function (a, b) {
        return b.annee - a.annee;
    });

    albums.forEach(function (album) {
        const sousTitre = "Nouveauté · " + album.artiste;
        const carte = creerCarte(album.image, album.nom, sousTitre, false, function () {
            ouvrirAlbum(album.nom);
        });
        conteneur.appendChild(carte);
    });
}

// Fonction principale de la page
function afficherPage() {
    afficherSalutation();
    afficherRecommandations();
    afficherAlbums(listeAlbums(musiques), document.querySelector("#albumsEnBoucle"));
    afficherEcoutesRecentes();
    afficherArtistes(artistes, document.querySelector("#artistesAccueil"));
    afficherPlaylistsVedettes();
    afficherNouveautes();

    // « Parce que vous avez écouté Luna Ray » : des titres d'autres artistes
    const suggestions = musiques.filter(function (musique) {
        return musique.artiste !== "Luna Ray";
    });
    afficherMusiques(suggestions.slice(0, 4), document.querySelector("#parceQueVousAvezEcoute"));

    // Boutons de la grande bannière
    document.querySelector("#boutonEcouterAlbum").addEventListener("click", function () {
        lireMusique(filtrerParAlbum("Afterglow")[0]);
        ouvrirAlbum("Afterglow");
    });

    document.querySelector("#boutonVoirArtiste").addEventListener("click", function () {
        ouvrirArtiste("Luna Ray");
    });
}

demarrerApplication(afficherPage);
