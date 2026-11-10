/* =========================================================
   VYBE — Créer ou modifier une playlist
   La même page sert aux deux : le mode ("creer" ou "modifier")
   a été enregistré par ouvrirEditeurPlaylist() (script.js).
   ========================================================= */

const mode = lireStockage("vybeModeEditeur", "creer");

const champTitre = document.querySelector("#champTitre");
const champDescription = document.querySelector("#champDescription");
const apercuPochette = document.querySelector("#apercuPochette");
const interrupteur = document.querySelector("#interrupteurPublique");
const erreurTitre = document.querySelector("#erreurTitre");

// Les valeurs choisies dans le formulaire
let imageChoisie = "../assets/images/blue.jpg";
let estPublique = false;

// Met à jour l'aperçu et entoure la pochette sélectionnée
function afficherPochetteChoisie() {
    apercuPochette.src = imageChoisie;

    document.querySelectorAll("#choixPochettes button").forEach(function (bouton) {
        if (bouton.getAttribute("data-image") === imageChoisie) {
            bouton.classList.add("actif");
        } else {
            bouton.classList.remove("actif");
        }
    });
}

// Met à jour l'interrupteur « playlist publique » et son texte
function afficherVisibilite() {
    const texte = document.querySelector("#texteVisibilite");

    if (estPublique) {
        interrupteur.classList.add("actif");
        texte.textContent = "Visible par tout le monde sur VYBE";
    } else {
        interrupteur.classList.remove("actif");
        texte.textContent = "Vous seul pouvez voir cette playlist";
    }
}

// Enregistre la playlist (création ou modification)
function enregistrerPlaylist() {
    const titre = champTitre.value.trim(); // trim() enlève les espaces inutiles

    // Vérification : le titre est obligatoire
    if (titre === "") {
        erreurTitre.classList.remove("cache");
        return;
    }

    if (mode === "modifier") {
        // On modifie les propriétés de la playlist existante
        const playlist = playlistChoisie();
        playlist.titre = titre;
        playlist.description = champDescription.value;
        playlist.image = imageChoisie;
        playlist.publique = estPublique;

        enregistrerPlaylists();
        ouvrirPlaylist(playlist.id);
    } else {
        // On crée un nouvel objet et on l'ajoute au tableau avec push()
        const nouvellePlaylist = {
            id: "playlist-" + Date.now(), // Date.now() donne un nombre unique
            titre: titre,
            description: champDescription.value,
            image: imageChoisie,
            publique: estPublique,
            titres: []
        };

        playlists.push(nouvellePlaylist);
        enregistrerPlaylists();
        ouvrirPlaylist(nouvellePlaylist.id);
    }
}

// Supprime la playlist en cours de modification
function supprimerPlaylist() {
    const playlist = playlistChoisie();

    // confirm() affiche une fenêtre avec OK / Annuler
    if (!confirm("Supprimer la playlist « " + playlist.titre + " » ?")) {
        return;
    }

    playlists = playlists.filter(function (autre) {
        return autre.id !== playlist.id;
    });

    enregistrerPlaylists();
    window.location.href = "playlists.html";
}

function afficherPage() {
    // En mode « modifier », on pré-remplit le formulaire
    if (mode === "modifier") {
        const playlist = playlistChoisie();

        document.querySelector("#titreEditeur").textContent = "Modifier la playlist";
        document.querySelector("#boutonEnregistrer").textContent = "Enregistrer";
        document.title = "Modifier la playlist — VYBE";

        champTitre.value = playlist.titre;
        champDescription.value = playlist.description;
        imageChoisie = playlist.image;
        estPublique = playlist.publique;

        // Le bouton « Supprimer » n'apparaît que s'il reste d'autres playlists
        if (playlists.length > 1) {
            document.querySelector("#boutonSupprimer").classList.remove("cache");
        }
    } else {
        document.title = "Créer une playlist — VYBE";
    }

    afficherPochetteChoisie();
    afficherVisibilite();

    // Clic sur une petite pochette = on la choisit
    document.querySelectorAll("#choixPochettes button").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            imageChoisie = bouton.getAttribute("data-image");
            afficherPochetteChoisie();
        });
    });

    // Clic sur l'interrupteur = public <-> privé
    interrupteur.addEventListener("click", function () {
        estPublique = !estPublique; // le ! inverse vrai et faux
        afficherVisibilite();
    });

    // Dès qu'on tape un titre, le message d'erreur disparaît
    champTitre.addEventListener("input", function () {
        erreurTitre.classList.add("cache");
    });

    document.querySelector("#boutonEnregistrer").addEventListener("click", enregistrerPlaylist);
    document.querySelector("#boutonSupprimer").addEventListener("click", supprimerPlaylist);
}

demarrerApplication(afficherPage);
