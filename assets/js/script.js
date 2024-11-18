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

function processOption(form) {
    //submit the data in the correct format (comma separated list of option as instruction)
    //without this part the code is creating multiple another key with the value of option
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optArray.join());
    return form
}



async function postForm(e) {
    const form = processOption(new FormData(document.getElementById("checksform")));
    for (let entry of form.entries()) {
        console.log(entry);
    }
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
        });
    
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
        } else {
            displayException(data)
            throw new Error(data.error);
        }
}

function displayErrors(data) {
    let results = "";
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results =+ `<div>At line <span class="line">${error.line}</span>,`;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
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
        displayException(data);
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


function displayException(data) {
    let heading = `an exception occurred`;

    results = `<div>the api returned the status code ${data.status_code}</div>`;
    results += `<div>error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();


}