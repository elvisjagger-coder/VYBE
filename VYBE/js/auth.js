/* =========================================================
   VYBE — Pages Connexion, Inscription et Mot de passe oublié
   Ce sont des démonstrations : aucun vrai compte n'est créé.
   ========================================================= */

const formulaire = document.querySelector("#formulaireAuth");
const pageOuverte = document.body.getAttribute("data-page");

// Bouton « œil » : afficher ou cacher le mot de passe
const boutonVoir = document.querySelector("#boutonVoirMotDePasse");

if (boutonVoir !== null) {
    boutonVoir.addEventListener("click", function () {
        const champ = document.querySelector("#champMotDePasse");

        // On change l'attribut "type" du champ
        if (champ.type === "password") {
            champ.type = "text";
        } else {
            champ.type = "password";
        }
    });
}

// Événement "submit" : l'utilisateur valide le formulaire.
// Le navigateur a déjà vérifié les champs "required" avant d'arriver ici.
formulaire.addEventListener("submit", function (event) {
    event.preventDefault(); // empêche le rechargement de la page

    if (pageOuverte === "mot-de-passe") {
        // On affiche simplement un message de confirmation
        document.querySelector("#messageRecuperation").classList.remove("cache");

    } else if (pageOuverte === "inscription") {
        // On enregistre le nom pour l'afficher dans l'application
        const nom = document.querySelector("#champNomComplet").value.trim();
        localStorage.setItem("vybeNom", JSON.stringify(nom));
        window.location.href = "accueil.html";

    } else {
        // Connexion : on entre dans l'application
        window.location.href = "accueil.html";
    }
});
