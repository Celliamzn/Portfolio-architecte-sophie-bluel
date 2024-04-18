// Initialisation 
let boutonObjets 
let boutonApparts
let boutonHotelEtRestaurants 
let boutonTous 
let works = [];

// Fonction de récupération des catégories via l'API
async function genererCategories() {
    const responseCat = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCat.json()
    const filtres = document.querySelector(".filtres")  
    const btnTous = document.createElement("button")
    btnTous.setAttribute("onclick","filter(0)")
    btnTous.setAttribute("id","0")
    btnTous.classList.add("active")
    btnTous.innerText = "Tous"
    filtres.appendChild(btnTous)
    for (let i=0; i<categories.length; i++){
        const category = categories[i]
        const nomBouton = document.createElement("button")
        nomBouton.setAttribute("onclick",`filter(${category.id})`)
        nomBouton.innerText = category.name
        nomBouton.id = category.id
        filtres.appendChild(nomBouton)
    }
    boutonObjets = document.getElementById("1")
    boutonApparts = document.getElementById("2")
    boutonHotelEtRestaurants = document.getElementById("3")
    boutonTous = document.getElementById("0")
}
//Utilisation de la fonction
genererCategories();

// Fonction de récuparation des works via l'API
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    displayWorks(works);
}

// Affichage des works dans la div class="gallery"
async function displayWorks(works) {
    //Supprimer la galerie présente
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    // Galerie entière (premier lancement)
    for (let i = 0; i < works.length; i++) {        
        const work = works[i];
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
getWorks();

/*** 
// Ajout du listener pour filtrer les works par objets
boutonObjets.addEventListener("click", function () {
    removeActiveClass()
    boutonObjets.classList.add("active");
    const worksFiltered = works.filter((work)=> work.categoryId === 1);
    displayWorks(worksFiltered);
});

// Ajout du listener pour filtrer les works par appartements

boutonApparts.addEventListener("click", function () {
    removeActiveClass()
    boutonApparts.classList.add("active");
    const worksFiltered = works.filter((work)=> work.categoryId === 2);
    displayWorks(worksFiltered);
});

// Ajout du listener pour filtrer les works par hotels et restaurants
boutonHotelEtRestaurants.addEventListener("click", function () {
    removeActiveClass()
    boutonHotelEtRestaurants.classList.add("active");
    const worksFiltered = works.filter((work)=> work.categoryId === 3);
    displayWorks(worksFiltered);
});

// Ajout du listener pour filtrer les works TOUS
boutonTous.addEventListener("click", function () {
    removeActiveClass()
    boutonTous.classList.add("active");
    displayWorks(works)
});
*/

//fonction qui retire la classe active (pour affichage css)
function removeActiveClass() {
    boutonApparts.classList.remove("active")
    boutonHotelEtRestaurants.classList.remove("active")
    boutonObjets.classList.remove("active")
    boutonTous.classList.remove("active")
}

//fonction pour le filtres
function filter(category) {
    removeActiveClass()
    if (category === 0){
        displayWorks(works)
        boutonTous.classList.add("active");
    } else if (category === 1) {
        boutonObjets.classList.add("active")
        displayWorks(works.filter((work)=> work.categoryId === 1))
    }else if (category === 2) {
        boutonApparts.classList.add("active")
        displayWorks(works.filter((work)=> work.categoryId === 2))
    }else if (category === 3) {
        boutonHotelEtRestaurants.classList.add("active")
        displayWorks(works.filter((work)=> work.categoryId === 3))
    }
}