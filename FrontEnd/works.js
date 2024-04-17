// Récupération des works via l'API


// Affichage des pièces dans la div class="gallery"
async function genererWorks() {
    
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json()

    for (let i = 0; i < works.length; i++) {        
        const work = works[i];
        const gallery = document.querySelector(".gallery");
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = work.title;

        
        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        gallery.appendChild(figureElement)
        
    }
}

// Premier affichage de la page
genererWorks();

/***
// Ajout du listener pour trier les pièces par ordre de prix croissant
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces)
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

// Ajout du listener pour filtrer les pièces non abordables
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.disponibilite;
    });
    // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});
*/