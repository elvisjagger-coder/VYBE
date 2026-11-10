/* =========================================================
   VYBE — Page Bibliothèque
   ========================================================= */

function afficherPage() {
    const albums = listeAlbums(musiques);

    // Les compteurs des 5 raccourcis
    document.querySelector("#nombreFavoris").textContent = favoris.length;
    document.querySelector("#nombrePlaylists").textContent = playlists.length;
    document.querySelector("#nombreAlbums").textContent = albums.length;
    document.querySelector("#nombreArtistes").textContent = artistesSuivis.length;
    document.querySelector("#nombreHistorique").textContent = historique.length;

    // « Ajoutés récemment » : d'abord la carte des titres likés...
    const conteneur = document.querySelector("#ajoutsRecents");
    const sousTitreFavoris = "Playlist · " + texteNombreTitres(favoris.length);

    const carteFavoris = creerCarte("", "Titres likés", sousTitreFavoris, false, function () {
        window.location.href = "favoris.html";
    });

    // Cette carte n'a pas de photo : on la remplace par un cœur sur fond violet
    const imageFavoris = carteFavoris.querySelector(".carte-image");
    imageFavoris.classList.add("carte-favoris-image");
    imageFavoris.innerHTML = icone("coeur");

    conteneur.appendChild(carteFavoris);

    // ... puis les 4 premiers albums
    for (let i = 0; i < albums.length && i < 4; i++) {
        conteneur.appendChild(creerCarteAlbum(albums[i]));
    }

    document.querySelector("#boutonCreerPlaylist").addEventListener("click", function () {
        ouvrirEditeurPlaylist("creer");
    });
}

demarrerApplication(afficherPage);
