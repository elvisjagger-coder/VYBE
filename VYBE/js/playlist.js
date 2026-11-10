/* =========================================================
   VYBE — Page d'une playlist
   Voir les titres, en retirer, en ajouter
   ========================================================= */

// La playlist à afficher a été enregistrée par ouvrirPlaylist() (script.js)
const playlist = playlistChoisie();
const champAjout = document.querySelector("#rechercheAjout");

// Affiche les titres de la playlist, chacun avec un bouton pour le retirer
function afficherTitresPlaylist() {
    const conteneur = document.querySelector("#titresPlaylist");
    const titres = musiquesDepuisIds(playlist.titres);

    conteneur.innerHTML = "";

    for (let i = 0; i < titres.length; i++) {
        const musique = titres[i];

        // On place la ligne de musique et le bouton « retirer » côte à côte
        const bloc = document.createElement("div");
        bloc.className = "ligne-retirable";
        bloc.appendChild(creerLigneMusique(musique, i + 1));

        const boutonRetirer = document.createElement("button");
        boutonRetirer.innerHTML = icone("fermer");
        boutonRetirer.setAttribute("aria-label", "Retirer " + musique.titre);

        boutonRetirer.addEventListener("click", function () {
            retirerDeLaPlaylist(playlist, musique.id);
            mettreAJourPage();
        });

        bloc.appendChild(boutonRetirer);
        conteneur.appendChild(bloc);
    }

    // Message spécial quand la playlist est vide
    if (titres.length === 0) {
        document.querySelector("#playlistVide").classList.remove("cache");
    } else {
        document.querySelector("#playlistVide").classList.add("cache");
    }

    document.querySelector("#nombreTitresPlaylist").textContent = texteNombreTitres(titres.length);
    mettreAJourCoeurs();
    surlignerMusiqueActuelle();
}

// Affiche les titres que l'on peut ajouter (filtrés par le champ de recherche)
function afficherSuggestionsAjout() {
    const conteneur = document.querySelector("#suggestionsAjout");
    const texte = champAjout.value.toLowerCase();

    const suggestions = musiques.filter(function (musique) {
        return musique.titre.toLowerCase().includes(texte)
            || musique.artiste.toLowerCase().includes(texte);
    });

    conteneur.innerHTML = "";

    suggestions.forEach(function (musique) {
        const dejaAjoute = playlist.titres.includes(musique.id);
        const ligne = document.createElement("div");
        ligne.className = "ligne-ajout";

        ligne.innerHTML = `
            <img src="${musique.image}" alt="">
            <div>
                <b>${musique.titre}</b>
                <small>${musique.artiste}</small>
            </div>
            <button aria-label="Ajouter ${musique.titre}"></button>
        `;

        const bouton = ligne.querySelector("button");

        if (dejaAjoute) {
            bouton.innerHTML = icone("valide");
            bouton.disabled = true;
        } else {
            bouton.innerHTML = icone("plus");
        }

        bouton.addEventListener("click", function () {
            ajouterALaPlaylist(playlist, musique.id);
            mettreAJourPage();
        });

        conteneur.appendChild(ligne);
    });
}

// Après un ajout ou un retrait, on réaffiche les deux listes
function mettreAJourPage() {
    afficherTitresPlaylist();
    afficherSuggestionsAjout();
}

function afficherPage() {
    document.title = playlist.titre + " — VYBE";

    // Bannière de la playlist
    document.querySelector("#pochettePlaylist").src = playlist.image;
    document.querySelector("#titrePlaylist").textContent = playlist.titre;

    if (playlist.publique) {
        document.querySelector("#typePlaylist").textContent = "Playlist publique";
    } else {
        document.querySelector("#typePlaylist").textContent = "Playlist privée";
    }

    if (playlist.description === "") {
        document.querySelector("#descriptionPlaylist").textContent = "Votre musique. À votre façon.";
    } else {
        document.querySelector("#descriptionPlaylist").textContent = playlist.description;
    }

    mettreAJourPage();

    // Événements
    champAjout.addEventListener("input", afficherSuggestionsAjout);

    document.querySelector("#boutonLirePlaylist").addEventListener("click", function () {
        const titres = musiquesDepuisIds(playlist.titres);

        if (titres.length > 0) {
            lireMusique(titres[0]);
        }
    });

    document.querySelector("#boutonModifierPlaylist").addEventListener("click", function () {
        ouvrirEditeurPlaylist("modifier");
    });
}

demarrerApplication(afficherPage);
