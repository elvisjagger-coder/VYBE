/* =========================================================
   VYBE — Page « Vos playlists »
   ========================================================= */

function afficherPage() {
    const grille = document.querySelector("#grillePlaylists");

    // Texte sous le titre : « 3 playlists · ... »
    let mot = " playlist";
    if (playlists.length > 1) {
        mot = " playlists";
    }
    document.querySelector("#compteurPlaylists").textContent =
        playlists.length + mot + " · Toutes vos humeurs, au même endroit.";

    // La première case de la grille sert à créer une playlist
    const carteCreer = document.createElement("button");
    carteCreer.className = "carte-creer";
    carteCreer.innerHTML = `
        ${icone("plus")}
        <b>Créer une playlist</b>
        <span>Commencez par un nom et une ambiance</span>
    `;
    carteCreer.addEventListener("click", function () {
        ouvrirEditeurPlaylist("creer");
    });
    grille.appendChild(carteCreer);

    // Puis une carte par playlist
    playlists.forEach(function (playlist) {
        grille.appendChild(creerCartePlaylist(playlist));
    });

    document.querySelector("#boutonCreerPlaylist").addEventListener("click", function () {
        ouvrirEditeurPlaylist("creer");
    });
}

demarrerApplication(afficherPage);
