/* =========================================================
   VYBE — Page Profil
   ========================================================= */

function afficherPage() {
    // On compte les playlists publiques avec une boucle
    let nombrePubliques = 0;

    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].publique) {
            nombrePubliques++;
        }
    }

    let mot = " playlist publique";
    if (nombrePubliques > 1) {
        mot = " playlists publiques";
    }
    document.querySelector("#resumeProfil").textContent =
        nombrePubliques + mot + " · Votre espace musical personnel";

    // Les 5 premiers artistes
    afficherArtistes(artistes.slice(0, 5), document.querySelector("#artistesProfil"));

    // Les playlists de l'utilisateur
    const conteneur = document.querySelector("#playlistsProfil");

    playlists.forEach(function (playlist) {
        conteneur.appendChild(creerCartePlaylist(playlist));
    });
}

demarrerApplication(afficherPage);
