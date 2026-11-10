/* =========================================================
   VYBE — Page d'un artiste
   ========================================================= */

// L'artiste à afficher a été enregistré par ouvrirArtiste() (script.js)
const nomArtisteChoisi = lireStockage("vybeArtisteChoisi", "Luna Ray");

// Le bouton « Suivre » change de texte selon que l'artiste est suivi ou non
function afficherBoutonSuivre() {
    const bouton = document.querySelector("#boutonSuivre");

    if (artistesSuivis.includes(nomArtisteChoisi)) {
        bouton.innerHTML = icone("valide") + " Suivi";
    } else {
        bouton.textContent = "Suivre";
    }
}

function basculerSuivi() {
    if (artistesSuivis.includes(nomArtisteChoisi)) {
        artistesSuivis = artistesSuivis.filter(function (nom) {
            return nom !== nomArtisteChoisi;
        });
    } else {
        artistesSuivis.push(nomArtisteChoisi);
    }

    ecrireStockage("vybeArtistesSuivis", artistesSuivis);
    afficherBoutonSuivre();
}

// Affiche la discographie. type = "tout", "albums" ou "singles"
function afficherDiscographie(type) {
    const conteneur = document.querySelector("#discographie");
    const albums = listeAlbums(filtrerParArtiste(nomArtisteChoisi));

    conteneur.innerHTML = "";

    albums.forEach(function (album) {
        // Un album a plusieurs titres, un single n'en a qu'un
        let categorie = "Single";
        if (album.nombreTitres > 1) {
            categorie = "Album";
        }

        const estDemande = type === "tout"
            || (type === "albums" && categorie === "Album")
            || (type === "singles" && categorie === "Single");

        if (estDemande) {
            const sousTitre = album.annee + " · " + categorie;
            const carte = creerCarte(album.image, album.nom, sousTitre, false, function () {
                ouvrirAlbum(album.nom);
            });
            conteneur.appendChild(carte);
        }
    });

    if (conteneur.innerHTML === "") {
        conteneur.innerHTML = `<p class="description-section">Rien à afficher dans cette catégorie.</p>`;
    }
}

// Fonction principale de la page
function afficherPage() {
    const artiste = trouverArtiste(nomArtisteChoisi);
    const titres = filtrerParArtiste(nomArtisteChoisi);

    document.title = artiste.nom + " — VYBE";

    // Bannière : l'image de fond est posée avec la propriété style
    document.querySelector("#heroArtiste").style.backgroundImage =
        `linear-gradient(90deg, #080613 0%, rgba(8,6,19,.68) 48%, rgba(8,6,19,.12)), url(${artiste.image})`;
    document.querySelector("#nomArtiste").textContent = artiste.nom;
    document.querySelector("#auditeursArtiste").textContent = artiste.auditeurs + " d'auditeurs mensuels";

    // Titres populaires et discographie
    afficherMusiques(titres, document.querySelector("#titresArtiste"));
    afficherDiscographie("tout");

    // Bloc « À propos »
    document.querySelector("#imageAPropos").src = artiste.image;
    document.querySelector("#accrocheArtiste").textContent = artiste.accroche;
    document.querySelector("#bioArtiste").textContent = artiste.bio;
    document.querySelector("#nombreAuditeurs").textContent = artiste.auditeurs;

    // Bouton « Lire » : lance le premier titre de l'artiste
    document.querySelector("#boutonLireArtiste").addEventListener("click", function () {
        lireMusique(titres[0]);
    });

    afficherBoutonSuivre();
    document.querySelector("#boutonSuivre").addEventListener("click", basculerSuivi);

    // Onglets de la discographie
    const onglets = document.querySelectorAll("#ongletsDiscographie button");

    onglets.forEach(function (onglet) {
        onglet.addEventListener("click", function () {
            onglets.forEach(function (autre) {
                autre.classList.remove("actif");
            });
            onglet.classList.add("actif");
            afficherDiscographie(onglet.getAttribute("data-type"));
        });
    });
}

demarrerApplication(afficherPage);
