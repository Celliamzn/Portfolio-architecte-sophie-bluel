const login = document.getElementById("login")
const logout = document.getElementById("logout")

let token = window.localStorage.getItem("token");
if (token !== null) {
    modeEdition()
} else {
    genererCategories();
}
console.log(token)

function modeEdition() {
    //édition de la bannière
    const headerAdmin = document.querySelector("body");
    const elementHeader = document.createElement("div");
    elementHeader.classList.add("admin")
    elementHeader.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
    headerAdmin.insertBefore(elementHeader,headerAdmin.firstChild);
    
    //édition du bouton modifier
    const endroitModifier = document.getElementById("modifier")
    const buttonModifier = document.createElement("button");
    buttonModifier.classList.add("buttonModifier modal-trigger")
    buttonModifier.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>modifier</p>';
    endroitModifier.appendChild(buttonModifier)
    
    //logout remplace login
    
    login.hidden = true
    logout.hidden = false

    //cacher les filtres
    const filtres = document.querySelector(".filtres");
    filtres.hidden = true
}

logout.addEventListener("click", function() {
    localStorage.removeItem("token")
})

// Initialisation 
let boutonObjets
let boutonApparts
let boutonHotelEtRestaurants 
let boutonTous 
let works = []

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
    switch (category) {
        case 0:
        displayWorks(works)
        boutonTous.classList.add("active");
        break
        case 1:
        boutonObjets.classList.add("active")
        displayWorks(works.filter((work)=> work.categoryId === 1))
        break
        case 2:
        boutonApparts.classList.add("active")
        displayWorks(works.filter((work)=> work.categoryId === 2))
        break
        case 3:
        boutonHotelEtRestaurants.classList.add("active")
        displayWorks(works.filter((work)=> work.categoryId === 3))
        
        break
    }
}

