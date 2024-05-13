/* Mon but est :
- Lorsque le form est rempli : redirection vers la page d'accueil si confirmée
message d'erreur si user / mdp pas correct
PENSER A STOCKER TOKEN POUR LA SUITE 

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
    const response = await (await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: userTest
    })).json()
    // Nous réagissons aux deux possibilités de réponse :
    if (response.message === "user not found") {
        //créer une alerte
        alert("E-mail et/ou mot de passe incorrect(s)")
    } else {
        //enregistrer le token 
        token = response.token;
        window.localStorage.setItem("token", token);
        window.location.href = 'index.html';
    }
}
)


