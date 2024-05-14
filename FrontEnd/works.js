const login = document.getElementById("login")
const logout = document.getElementById("logout")

let categories
let token
let works = []


async function setup() {
    // premierement, récupération catégories API
    const responseCat = await fetch("http://localhost:5678/api/categories");
    categories = await responseCat.json()
    
    //Soit site basique avec les catégories soit admin avec le mode édition
    token = window.localStorage.getItem("token");
    if (token !== null) {
        modeEdit()
        generateChoiceCategorie()
    } else {
        generateCategories();
    }
}
setup()

// Fonction de récuparation des works via l'API
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    await displayWorks(works);    
}
// Affichage de la page
getWorks();



//Effet déconnexion
logout.addEventListener("click", function() {
    localStorage.removeItem("token")
})

const btnPrecedent = document.querySelector(".modal-precedent");

//Mode édition 
function modeEdit() {
    //édition de la bannière
    const headerAdmin = document.querySelector("body");
    const elementHeader = document.createElement("div");
    elementHeader.classList.add("admin")
    elementHeader.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
    headerAdmin.insertBefore(elementHeader,headerAdmin.firstChild);
    
    //édition du bouton modifier
    const addButtonModifier = document.getElementById("modifier")
    const buttonModifier = document.createElement("button");
    buttonModifier.classList.add("buttonModifier")
    buttonModifier.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>modifier</p>';
    addButtonModifier.appendChild(buttonModifier)
    buttonModifier.addEventListener("click", async() => {
        toggleModal();
        btnPrecedent.hidden = true
        await displayWorksEdit(works)})
        
        //logout remplace login
        login.hidden = true 
        logout.hidden = false
        
        //cacher les filtres
        const filters = document.querySelector(".filters");
        filters.hidden = true
    }
    
    // Initialisation 
    let buttonObjets
    let buttonApparts
    let buttonHotelEtRestaurants 
    let buttonTous 
    
    
    // Fonction de récupération des catégories via l'API
    async function generateCategories() {
        
        //construction des boutons filtres : tous en premier puis for pour les autres
        const filters = document.querySelector(".filters")  
        const btnTous = document.createElement("button")
        btnTous.setAttribute("onclick","filter(0)")
        btnTous.setAttribute("id","0")
        btnTous.classList.add("active")
        btnTous.innerText = "Tous"
        filters.appendChild(btnTous)
        
        for (let i=0; i<categories.length; i++){
            const category = categories[i]
            const nombutton = document.createElement("button")
            nombutton.setAttribute("onclick",`filter(${category.id})`)
            nombutton.innerText = category.name
            nombutton.id = category.id
            filters.appendChild(nombutton)
        }
        
        buttonObjets = document.getElementById("1")
        buttonApparts = document.getElementById("2")
        buttonHotelEtRestaurants = document.getElementById("3")
        buttonTous = document.getElementById("0")
    }
    
    
    
    // Affichage des works dans la gallery
    async function displayWorks(works) {
        //Supprimer la galerie présente
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        // Galerie avec les works demandés (tous au lancement)
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
    
    
    
    //fonction qui retire la classe active (pour affichage css)
    function removeActiveClass() {
        buttonApparts.classList.remove("active")
        buttonHotelEtRestaurants.classList.remove("active")
        buttonObjets.classList.remove("active")
        buttonTous.classList.remove("active")
    }
    
    //fonction pour les filtres
    function filter(category) {
        removeActiveClass()
        switch (category) {
            case 0:
            displayWorks(works)
            buttonTous.classList.add("active");
            break
            case 1:
            buttonObjets.classList.add("active")
            displayWorks(works.filter((work)=> work.categoryId === 1))
            break
            case 2:
            buttonApparts.classList.add("active")
            displayWorks(works.filter((work)=> work.categoryId === 2))
            break
            case 3:
            buttonHotelEtRestaurants.classList.add("active")
            displayWorks(works.filter((work)=> work.categoryId === 3))
            break
        }
    }
    
    // changement entre modale de la galerie et modal de nouveau work
    const modalAdd = document.querySelector(".modal-add-work")
    const modalEdit = document.querySelector(".modal-works-edit")	
    const btnAddWork = document.querySelector(".btn-add-work")
    
    
    btnAddWork.addEventListener("click", () => {
        modalAdd.classList.remove("display-none")
        modalAdd.classList.add("display")
        modalEdit.classList.remove("display")
        modalEdit.classList.add("display-none")
        btnPrecedent.hidden = false;
    })
    
    btnPrecedent.addEventListener("click", () => {
        
        btnPrecedent.hidden = true
        modalAdd.classList.remove("display")
        modalAdd.classList.add("display-none")
        modalEdit.classList.add("display")
        modalEdit.classList.remove("display-none")
    })
    
    //affichage des works dans la modale EDIT donc rajout button delete à chaque image
    async function displayWorksEdit(_works) {
        let galleryEdit = document.querySelector(".gallery-edit");
        galleryEdit.innerHTML = "";
        for (let i = 0; i < _works.length; i++) {        
            const work = _works[i];
            const imgElement = document.createElement("img");
            imgElement.src = work.imageUrl;
            imgElement.alt = work.title;
            imgElement.classList.add("editPhoto")
            const deleteWork = document.createElement("btn")
            deleteWork.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
            deleteWork.classList.add("deletebtn")
            deleteWork.setAttribute("id", `${_works[i]}`);
            deleteWork.addEventListener("click", async (e) => {
                await fetch(`http://localhost:5678/api/works/${_works[i].id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`} 
            }) 
            await getWorks()
            await displayWorksEdit(works)
        });
        const picAndBtn = document.createElement("div")
        picAndBtn.classList.add("picAndBtn")
        picAndBtn.appendChild(imgElement) 
        picAndBtn.appendChild(deleteWork)
        galleryEdit.appendChild(picAndBtn)
    }
}

// trigger pour ouvrir/fermer modale
const modalContainer = document.querySelector(".modal-container")
const modalTriggers = document.querySelectorAll(".modalTrigger");
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
    modalContainer.classList.toggle("activEdit")
    modalAdd.classList.remove("display")
    modalAdd.classList.add("display-none")
    modalEdit.classList.add("display")
    modalEdit.classList.remove("display-none")
}
// quitter modale avec echap 
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        modalContainer.classList.remove("activEdit")
    }
})

// Choix catégorie du formulaire
async function generateChoiceCategorie() {
    const selectionCategorie = document.getElementById("category")
    for (let i=0; i<categories.length; i++){
        const category = categories[i]
        const optionCategorie = document.createElement("option")
        optionCategorie.value = category.id
        optionCategorie.innerText = category.name
        selectionCategorie.appendChild(optionCategorie)
    }
}


const submit = document.getElementById("valider")  

let inputPicture = document.getElementById("picture") 
inputPicture.addEventListener("change", () => previewPicture())
const divToPreview = document.querySelector(".input-add-picture")
//Montrer la photo choisie si bien une image + bouton VALIDER vert et utilisable
function previewPicture() {
    console.log('previewPicture')
    console.log(inputPicture)
    if(inputPicture.files[0].type.match('image.*')) {
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const picture = new Image()
            picture.addEventListener('load', () => {
                divToPreview.innerHTML = ""
                divToPreview.appendChild(picture)
            })
            picture.src = reader.result
            picture.classList.add("margin-auto")
        }
        
        reader.readAsDataURL(inputPicture.files[0]);
        submit.disabled = false
    }
}

const inputTitle = document.getElementById("title")
const inputCategory = document.getElementById("category") 
const formReset = document.getElementById("form-add")
const categoryName = inputCategory.options[inputCategory.selectedIndex]
const categoryId = inputCategory.options[inputCategory.selectedIndex].id

//vérification remplissage du formulaire, ajouter work à l'API et fermeture de la modale
submit.addEventListener("click", async (event) => {
    event.preventDefault()

    let newWork = new FormData()
    let valide = formValidation(inputTitle.value, parseInt(inputCategory.value))
    if (valide === true) {
        
        newWork.append('image', inputPicture.files[0])
        newWork.append('title', inputTitle.value)
        newWork.append('category', parseInt(inputCategory.value))
        await addWork(token, newWork)
        await getWorks()
        await displayWorksEdit(works) 
        
        const formReset = document.getElementById("form-add")
        formReset.reset()  
        divToPreview.innerHTML = '<div class="input-add-picture"><i class="fa-regular fa-image space preview"></i><label for="picture" id="labelForPicture" >+ Ajouter photo</label><input type="file" required id="picture" accept=".png, .jpg" class="space" style="visibility: hidden;"><p class="space picture-accepted">jpg, png : 4mo max</p></div>'
        inputPicture = document.getElementById("picture")
        inputPicture.addEventListener("change", () => previewPicture())
        submit.disabled = true
        modalContainer.classList.remove("activEdit")
    }
})

//alert quand titre ou catégorie vide
function formValidation(title, categoryId) {
    if (title.length === 0) {
        alert("veuillez ajouter un titre")
        console.log(categoryId)
        return false
    }
    if (!categoryId) {
        alert("Veuillez choisir une catégorie")
        return false
    } else {
        return true
    }
}

//envoi du nouveau work à l'API
async function addWork(token, newWork) {
    await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: newWork,
    headers: { Authorization: `Bearer ${token}`}
})
}




