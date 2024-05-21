/*  

sophie.bluel@test.tld
S0phie

*/
let token = "";
const formulaireLogin = document.querySelector(".form-login");
formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    //on veut récupérer les valeurs reçues, en json puis envoyer une reqête à l'API avec
    const preUserTest = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    }
    const userTest = JSON.stringify(preUserTest);
    const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: userTest
})

let errorLogin = document.getElementById("error")
// Nous réagissons aux deux possibilités de réponse :
if (response.status !== 200) {
    //créer une alerte
    errorLogin.hidden = false;
} else {
    //enregistrer le token 
    token = (await response.json()).token;
    window.localStorage.setItem("token", token);
    window.location.href = 'index.html';
    
}
}
)


