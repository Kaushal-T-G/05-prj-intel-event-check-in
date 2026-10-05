//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

//Track attendance
let count = 0;
const maxCount = 50;
let teamCounts = { water: 0, zero: 0, power: 0 };
let attendees = [];

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

//Save to local storage
function saveData() {
  localStorage.setItem(
    "summitData",
    JSON.stringify({ count, teamCounts, attendees })
  );
}

//Load from local storage
function loadData() {
  const saved = JSON.parse(localStorage.getItem("summitData"));
  if (saved) {
    count = saved.count;
    teamCounts = saved.teamCounts;
    attendees = saved.attendees;
  }
}

//Update everything on the page
function updateDisplay() {
  attendeeCountEl.textContent = count;
  progressBar.style.width = Math.round((count / maxCount) * 100) + "%";

  for (const team in teamCounts) {
    document.getElementById(team + "Count").textContent = teamCounts[team];
  }

  attendeeList.innerHTML = "";
  attendees.forEach(function (person) {
    const li = document.createElement("li");
    li.className = "attendee-item " + person.team;

    const nameSpan = document.createElement("span");
    nameSpan.textContent = person.name;

    const teamSpan = document.createElement("span");
    teamSpan.className = "attendee-team";
    teamSpan.textContent = teamNames[person.team];

    li.append(nameSpan, teamSpan);
    attendeeList.appendChild(li);
  });

  if (count >= maxCount) {
    celebrate();
  }
}

//Celebration: find the team with the most check-ins
function celebrate() {
  let winner = "water";
  for (const team in teamCounts) {
    if (teamCounts[team] > teamCounts[winner]) {
      winner = team;
    }
  }
  greeting.textContent = `🎉 Goal reached! ${teamNames[winner]} wins!`;
  greeting.className = "success-message celebration";
  greeting.style.display = "block";
}

//Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (count >= maxCount) return;

  //Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name) return;

  //Update counts and list
  count++;
  teamCounts[team]++;
  attendees.push({ name: name, team: team });

  saveData();
  updateDisplay();

  //Show welcome message (unless the goal was just reached)
  if (count < maxCount) {
    greeting.textContent = `Welcome, ${name} from ${teamName}!`;
    greeting.className = "success-message";
    greeting.style.display = "block";
  }

  form.reset();
});

//Run on page load
loadData();
updateDisplay();