/* =========================================================
   VYBE — Page Paramètres
   Onglet « Compte » (nom affiché) et onglet « Apparence »
   ========================================================= */

const champNom = document.querySelector("#champNom");
const messageEnregistre = document.querySelector("#messageEnregistre");

// Affiche un onglet et cache l'autre
function afficherOnglet(nom) {
    const ongletCompte = document.querySelector("#ongletCompte");
    const ongletApparence = document.querySelector("#ongletApparence");
    const panneauCompte = document.querySelector("#panneauCompte");
    const panneauApparence = document.querySelector("#panneauApparence");

    if (nom === "compte") {
        ongletCompte.classList.add("actif");
        ongletApparence.classList.remove("actif");
        panneauCompte.classList.remove("cache");
        panneauApparence.classList.add("cache");
    } else {
        ongletCompte.classList.remove("actif");
        ongletApparence.classList.add("actif");
        panneauCompte.classList.add("cache");
        panneauApparence.classList.remove("cache");
    }
}

// Enregistre le nouveau nom et l'affiche partout dans la page
function enregistrerNom() {
    const nouveauNom = champNom.value.trim();

    if (nouveauNom === "") {
        return; // on refuse un nom vide
    }

    nomUtilisateur = nouveauNom;
    ecrireStockage("vybeNom", nomUtilisateur);
    afficherNomUtilisateur();
    messageEnregistre.classList.remove("cache");
}

// Prépare un interrupteur lié à un réglage enregistré dans le navigateur
function brancherInterrupteur(idBouton, cle) {
    const bouton = document.querySelector(idBouton);

    // État de départ
    if (lireStockage(cle, false)) {
        bouton.classList.add("actif");
    }

    bouton.addEventListener("click", function () {
        const nouvelleValeur = !lireStockage(cle, false);

        ecrireStockage(cle, nouvelleValeur);
        bouton.classList.toggle("actif"); // ajoute la classe, ou l'enlève si elle y est
        appliquerPreferences();
    });
}

function afficherPage() {
    champNom.value = nomUtilisateur;

    document.querySelector("#ongletCompte").addEventListener("click", function () {
        afficherOnglet("compte");
    });

    document.querySelector("#ongletApparence").addEventListener("click", function () {
        afficherOnglet("apparence");
    });

    document.querySelector("#boutonEnregistrerNom").addEventListener("click", enregistrerNom);

    // Si on modifie le champ, le message « Profil mis à jour » disparaît
    champNom.addEventListener("input", function () {
        messageEnregistre.classList.add("cache");
    });

    brancherInterrupteur("#interrupteurAnimations", "vybeAnimationsReduites");
    brancherInterrupteur("#interrupteurPochettes", "vybePochettesCompactes");
}

demarrerApplication(afficherPage);
