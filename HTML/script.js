let username;

document.getElementById("MySubmit").onclick = function(){
    username = document.getElementById("Username").value;
    console.log(username);
    document.getElementById("MyH1").textContent = `Hello ${username}`
}
