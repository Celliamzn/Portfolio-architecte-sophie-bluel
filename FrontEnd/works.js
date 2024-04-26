//Effet connexion / déconnexion
const login = document.getElementById("login")
const logout = document.getElementById("logout")

let token = window.localStorage.getItem("token");
if (token !== null) {
    modeEdition()
} else {
    genererCategories();
}

logout.addEventListener("click", function() {
    localStorage.removeItem("token")
})

//Mode édition 
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
    buttonModifier.classList.add("buttonModifier")
    buttonModifier.classList.add("modalTrigger")
    buttonModifier.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>modifier</p>';
    endroitModifier.appendChild(buttonModifier)
    buttonModifier.addEventListener("click", async() => await displayWorksEdit(works))
    
    //logout remplace login
    login.hidden = true 
    logout.hidden = false
    
    //cacher les filtres
    const filtres = document.querySelector(".filtres");
    filtres.hidden = true
}

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

// Fonction de récuparation des works via l'API
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    await displayWorks(works);    
}

// Affichage des works dans la gallery
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

//fonction pour les filtres
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

let idSupp 
let btnSupp
const contenuModal = document.querySelector(".modal-contenu")

//Afficher modale
function afficherModal() {
    const titreModal = document.createElement("h3")
titreModal.innerText = "Galerie Photo"	
const divGallery = document.createElement("div")
divGallery.classList.add("galleryEdit")
const barre = document.createElement("hr")
const ajoutWork = document.createElement("button")
ajoutWork.classList.add("ajoutWork")
ajoutWork.innerText = "Ajouter une photo"
contenuModal.appendChild(titreModal)
contenuModal.appendChild(divGallery)
contenuModal.appendChild(barre)
contenuModal.appendChild(ajoutWork)
}

afficherModal()

async function displayWorksEdit(_works) {
    let galleryEdit = document.querySelector(".galleryEdit");
    galleryEdit.innerHTML = "";
    for (let i = 0; i < _works.length; i++) {        
        const work = _works[i];
        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;
        imgElement.classList.add("editPhoto")
        const supprimerWork = document.createElement("btn")
        supprimerWork.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
        supprimerWork.classList.add("supprimerbtn")
        supprimerWork.setAttribute("id", `${_works[i]}`);
        supprimerWork.addEventListener("click", async (e) => {
            await fetch(`http://localhost:5678/api/works/${_works[i].id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`} 
        }) 
        await getWorks()
        console.log(works)
        await displayWorksEdit(works)
    });
    const photoEtBouton = document.createElement("div")
    photoEtBouton.classList.add("photoEtBtn")
    photoEtBouton.appendChild(imgElement) 
    photoEtBouton.appendChild(supprimerWork)
    galleryEdit.appendChild(photoEtBouton)
}
}


const modalContainer = document.querySelector(".modal-container")
const modalTriggers = document.querySelectorAll(".modalTrigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
    modalContainer.classList.toggle("activEdit")
}

/* quitter modale avec echap */
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        modalContainer.classList.remove("activEdit")
    }
})


// Modale ajouter photo :
const addWork = document.querySelector(".ajoutWork");
addWork.addEventListener("click", () => {
    contenuModal.innerHTML=""
    const btnPrecedent = document.querySelector(".modalPrecedent");
    btnPrecedent.hidden = false;
    btnPrecedent.addEventListener("click", async () => {
        btnPrecedent.hidden = true
        afficherModal()
        await displayWorksEdit(works)
    })
})