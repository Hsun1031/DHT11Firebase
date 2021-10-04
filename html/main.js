const button0  = document.getElementById("button0");
const button1  = document.getElementById("button1");
const button2  = document.getElementById("button2");
const button3  = document.getElementById("button3");
const textarea = document.getElementById("textarea");

const data = {
    Name:   "setDHT11Data",
    Year:   2021,
    Month:    10,
    Day:       1,
    Hour:     10,
    Min:       0,
    Temp:    [20,20,20,20,20,20],
    Hum:     [50,50,50,50,50,50],
    Id:     "ry",
    Passwd: "123456"
};

textarea.value = JSON.stringify(data);

button0.addEventListener("click", () => {
    let _json = JSON.parse(textarea.value);
    _json.Name = "checkIdPasswd";
    textarea.value = JSON.stringify(_json);
    postJsonCheckID("checkIdPasswd", textarea.value);
});

button1.addEventListener("click", () => {
    let _json = JSON.parse(textarea.value);
    _json.Name = "setDHT11Data";
    textarea.value = JSON.stringify(_json);
    postJsonCheckID("setDHT11Data", textarea.value);
});

button2.addEventListener("click", () => {
    let _json = JSON.parse(textarea.value);
    _json.Name = "getDHT11Data";
    textarea.value = JSON.stringify(_json);
    postJsonCheckID("getDHT11Data", textarea.value);
});

button3.addEventListener("click", () => {
    let _json = JSON.parse(textarea.value);
    _json.Name = "setExampleDHT11";
    textarea.value = JSON.stringify(_json);
    postJsonCheckID("setExampleDHT11", textarea.value);
});

function postJsonCheckID(url, json) {
    let request = new XMLHttpRequest();
    request.open("POST", window.location.origin + "/data/" + url, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.send(json);

    request.addEventListener("load", () => {
        console.log("Heroku Msg[POST Json]:", request.responseText);
    });
}