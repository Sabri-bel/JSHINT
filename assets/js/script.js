//create a get request

//save the key as a constant:
const API_KEY = "mQR8hTCXcTfwTeqYnKheB-op4jA";

//url is used for the call:
const API_URL = "https://ci-jshint.herokuapp.com/api";

//trigger a modal with bootstraps:
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

//event listener for the button - get method:
document.getElementById("status").addEventListener("click", e => getStatus(e));
//event listener for the post method
document.getElementById("submit").addEventListener("click", e => postForm(e));


async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    //check if the code is working :
    // for (let e of form.entries()) {
     //   console.log(e);
    //}
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
                    "Authorization": API_KEY,
                 },
        body: form,
        })
}

//make a get request to the api and pass the fucntion displayed
// async function await the promises going thru

async function getStatus(e) {
    //get request require the api url -> create a const for that:
    //https://ci-jshint.herokuapp.com/api?api_key=thisismykey:
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    //await a response:
    const response = await fetch(queryString);

    //convert the response to json format:
    const data = await response.json();

    //throw the error if the response is not ok
    if (response.ok) {
        displayStatus(data)
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    //write the text of the modal banner:
    let heading = "API key status";
    let results = `<div>Your key is valid until</div>`;
    
    //add the data stored:
    results += `<div class="key-status"> ${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}