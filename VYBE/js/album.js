/* =========================================================
   VYBE — Page d'un album
   ========================================================= */

// L'album à afficher a été enregistré par ouvrirAlbum() (script.js)
const nomAlbumChoisi = lireStockage("vybeAlbumChoisi", "Afterglow");

function afficherPage() {
    let titres = filtrerParAlbum(nomAlbumChoisi);

    // Sécurité : si l'album n'existe pas, on affiche le premier de la liste
    if (titres.length === 0) {
        titres = filtrerParAlbum(musiques[0].album);
    }

    const premierTitre = titres[0];
    const artiste = trouverArtiste(premierTitre.artiste);

    document.title = premierTitre.album + " — VYBE";

    // Bannière de l'album
    document.querySelector("#fondAlbum").style.backgroundImage = `url(${premierTitre.image})`;
    document.querySelector("#pochetteAlbum").src = premierTitre.image;
    document.querySelector("#titreAlbum").textContent = premierTitre.album;
    document.querySelector("#descriptionAlbum").textContent =
        "Un album de " + artiste.nom + ". " + artiste.accroche;
    document.querySelector("#imageArtisteAlbum").src = artiste.image;
    document.querySelector("#artisteAlbum").textContent = artiste.nom;
    document.querySelector("#anneeAlbum").textContent = premierTitre.annee;
    document.querySelector("#nombreTitresAlbum").textContent = texteNombreTitres(titres.length);
    document.querySelector("#noteAlbum").textContent =
        "Sorti en " + premierTitre.annee + " · © " + premierTitre.annee + " VYBE Music. Extraits audio de démonstration.";

    // Liste des titres
    afficherMusiques(titres, document.querySelector("#titresAlbum"));

    // Les autres albums : tous sauf celui qui est affiché
    const autresAlbums = listeAlbums(musiques).filter(function (album) {
        return album.nom !== premierTitre.album;
    });
    afficherAlbums(autresAlbums, document.querySelector("#autresAlbums"));

    // Boutons
    document.querySelector("#boutonLireAlbum").addEventListener("click", function () {
        lireMusique(premierTitre);
    });

    document.querySelector("#artisteAlbum").addEventListener("click", function () {
        ouvrirArtiste(artiste.nom);
    });

    // Le cœur de la bannière ajoute le premier titre aux favoris
    const coeur = document.querySelector("#coeurAlbum");
    coeur.setAttribute("data-coeur", premierTitre.id);
    coeur.addEventListener("click", function () {
        basculerFavori(premierTitre.id);
    });
}

demarrerApplication(afficherPage);
