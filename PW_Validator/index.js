// DISPLAYERS 
let form = document.querySelector("#form");
let msg = document.querySelector("#msg");

// INPUT VALUES
let input = document.querySelector("#name");
let password = document.querySelector("#passw");
let Confirm_Pass = document.querySelector("#confirm-passw");

// BUTTON
const SubmitButton = document.querySelector('#but');

// MESSAGES
let LV = document.querySelector("#LiveValue");
let PV = document.querySelector("#LivePass");
let CM = document.querySelector("#ConfirmMsg");

// COUNTER
let value = 0;

// STATE FLAGS
let NameLength = false;
let PassLength = false;

SubmitButton.disabled = true;


// NAME CHECK
input.addEventListener("input", (event)=>{

    let liveValue = event.target.value;
    LV.textContent =
    `Characters: ${liveValue.length}`;
    NameLength =
    liveValue.length > 3;
    updateButton();

});


// PASSWORD STRENGTH
password.addEventListener("input", (event)=>{
    let length =
    event.target.value.length;

    if(length < 5){
        PV.textContent =
        "Weak password";
        PassLength = false;
    }
    else if(length < 8){
        PV.textContent =
        "Medium password";
        PassLength = false;
    }
    else{
        PV.textContent =
        "Strong password";
        PassLength = true;
    }
    checkPasswordMatch();
    updateButton();

});


// CONFIRM PASSWORD
Confirm_Pass.addEventListener("input", ()=>{
    checkPasswordMatch();
    updateButton();
});


// PASSWORD MATCH CHECK
function checkPasswordMatch(){
    if(password.value ===
       Confirm_Pass.value){
        CM.textContent =
        "Passwords match";
    }
    else{
        CM.textContent =
        "Passwords don't match";
    }
}

// BUTTON ENABLE LOGIC
function updateButton(){
    if(NameLength &&
       PassLength &&
       password.value === Confirm_Pass.value){
       SubmitButton.disabled = false;
    }
    else{
        SubmitButton.disabled = true;
    }
}

// FORM SUBMIT
form.addEventListener("submit", (event)=>{
    event.preventDefault();

    if(SubmitButton.disabled === false){
        value++;
        msg.textContent =
        `Hello, ${input.value} (${value})`;
    }
});
