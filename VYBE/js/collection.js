/* =========================================================
   VYBE — Pages de la collection
   Ce fichier sert à 4 pages qui se ressemblent beaucoup :
   favoris.html, albums.html, artistes.html et historique.html.
   La variable pageActuelle (script.js) dit laquelle est ouverte.
   ========================================================= */

const conteneurListe = document.querySelector("#liste");
const selectTri = document.querySelector("#tri");

// Trie un tableau d'objets par ordre alphabétique.
// propriete = le nom de la propriété à comparer ("titre" ou "nom")
function trierParNom(liste, propriete) {
    // localeCompare() compare deux textes en respectant l'alphabet français
    liste.sort(function (a, b) {
        return a[propriete].localeCompare(b[propriete]);
    });
}

function afficherMessageVide(titre, texte) {
    conteneurListe.innerHTML = `
        <div class="etat-vide">
            ${icone("coeur")}
            <h2>${titre}</h2>
            <p>${texte}</p>
            <a href="recherche.html" class="bouton bouton-principal">Découvrir la musique</a>
        </div>
    `;
}

// Affiche la liste qui correspond à la page ouverte
function afficherListe() {
    const triAlphabetique = selectTri.value === "alphabetique";

    if (pageActuelle === "favoris") {
        // Les derniers titres likés apparaissent en premier
        const titres = musiquesDepuisIds(favoris).reverse();

        if (triAlphabetique) {
            trierParNom(titres, "titre");
        }

        document.querySelector("#sousTitre").textContent =
            texteNombreTitres(titres.length) + " · Enregistrés par vous";

        if (titres.length === 0) {
            afficherMessageVide("Gardez les titres que vous aimez.", "Cliquez sur le cœur à côté d'un titre pour l'ajouter ici.");
        } else {
            afficherMusiques(titres, conteneurListe);
        }

    } else if (pageActuelle === "historique") {
        const titres = musiquesDepuisIds(historique);

        if (triAlphabetique) {
            trierParNom(titres, "titre");
        }

        if (titres.length === 0) {
            afficherMessageVide("Rien pour le moment.", "Les titres que vous écoutez apparaîtront ici.");
        } else {
            afficherMusiques(titres, conteneurListe);
        }

    } else if (pageActuelle === "albums") {
        const albums = listeAlbums(musiques);

        if (triAlphabetique) {
            trierParNom(albums, "nom");
        }
        afficherAlbums(albums, conteneurListe);

    } else if (pageActuelle === "artistes") {
        // On garde seulement les artistes suivis par l'utilisateur
        const suivis = artistes.filter(function (artiste) {
            return artistesSuivis.includes(artiste.nom);
        });

        if (triAlphabetique) {
            trierParNom(suivis, "nom");
        }

        if (suivis.length === 0) {
            conteneurListe.className = "";
            afficherMessageVide("Vous ne suivez encore aucun artiste.", "Ouvrez la page d'un artiste et cliquez sur « Suivre ».");
        } else {
            afficherArtistes(suivis, conteneurListe);
        }
    }
}

function afficherPage() {
    afficherListe();

    // Événement "change" : l'utilisateur choisit un autre tri
    selectTri.addEventListener("change", afficherListe);

    if (pageActuelle === "favoris") {
        // Si on retire un cœur, la liste des favoris se met à jour toute seule
        quandFavorisChangent = afficherListe;

        // Bouton « Tout lire » : lance le premier titre de la liste
        document.querySelector("#boutonToutLire").addEventListener("click", function () {
            const premiereLigne = conteneurListe.querySelector(".ligne-numero");

            if (premiereLigne !== null) {
                premiereLigne.click();
            }
        });
    }
}

demarrerApplication(afficherPage);
