const KELVIN = 273;
const country = "in";
const API_KEY = "5a5502a2b89bcd8b236994660a8a00aa";
const Base_Url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;

function getFormatDate(date) {
  return new Date(date).toLocaleDateString();
}

function handleDomUpdate(data) {
  const entries = document.getElementById("data");
  if (!data.length) return;
  data.forEach((item, index) => {
    if (document.getElementById(`data-${index}`)) return;
    const row = document.createElement("div");
    row.id = `data-${index}`;
    row.className = 'details'
    row.innerHTML = `
      <p class="details-title white">${getFormatDate(new Date(item.date))}</p>
      <p class="details-title white">${item.temp.toFixed(1)}</p>
      <p class="details-title white">${item.userInput}</p>
    `;
    entries.appendChild(row);
  });
}

function responseChecker(response) {
  if (response.status !== 200) throw new Error(response);
  return response.json();
}


function fetchAppData() {
  fetch("/data")
  .then(responseChecker)
  .then(handleDomUpdate);
}

function postJournalData(payload) {
  fetch("/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  .then(responseChecker)
  .then(handleDomUpdate);
}

function fetchData() {
  const zip = document.getElementById("zip").value;
  const userInput = document.getElementById("feelings").value;
  fetch(`${Base_Url}&zip=${zip},${country}`)
  .then(responseChecker)
  .then(data => {
    const payload = {
      temp: data.main.temp - KELVIN,
      date: new Date(),
      userInput,
    };
    postJournalData(payload);
  });
}

function validate() {
  const zip = document.getElementById("zip");
  if (!zip.value || isNaN(Number(zip.value))) {
    zip.classList.add("input-error");
    return false;
  }
  zip.classList.remove("input-error");
  return true;
}

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  if (validate()) {
    fetchData();
  }
});

fetchAppData();
