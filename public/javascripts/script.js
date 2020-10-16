// @ts-nocheck
const numberHeading = "No.".padStart(4);
const dateHeading = "Date";
const missionHeading = "Mission";
const rocketHeading = "Rocket";
const targetHeading = "Destination";
const customersHeading = "Customers";

// CSS
const cssListContainer = "list-container";
const cssListHeading = "list-heading";
const cssListHeadingItem = "list-heading-item";
const cssListBody = "list-body";
const cssListBodyItem = "list-body-item";
const cssListItem = "list-item";
const cssSilver = "silver";
const cssGold = "gold";
const cssDelete = "delete";
const cssListNumber = "list-number";
const cssListDate = "list-date";
const cssListMission = "list-mission";
const cssListRocket = "list-rocket";
const cssListDestination = "list-destination";
const cssListCustomers = "list-customers";

let launches = [];
let upcoming = [];

const initValues = () => {
  const launchDaySelector = document.getElementById("launch-day");
  if (launchDaySelector) {
    const today = new Date().toISOString().split("T")[0];
    launchDaySelector.setAttribute("min", today);
    launchDaySelector.setAttribute("value", today);
  }
};

const setVideo = () => {
  const video = document.querySelector('.spacevideo');
  video.playbackRate = 0.2;
};

const loadLaunches = () => {
  return fetch("/launches")
    .then(launchesResponse => launchesResponse.json())
    .then(fetchedLaunches => {
      launches = fetchedLaunches.sort((a, b) => {
        return a.flightNumber < b.flightNumber;
      });
    });
};

const loadPlanets = async () => {
  const planetSelector = document.getElementById("planets-selector");
  if (planetSelector) {
    return fetch("/planets")
      .then(planetsResponse => planetsResponse.json())
      .then(planets => {
        planets.forEach((planet) => {
          planetSelector.innerHTML += `<option value="${planet.kepler_name}">${planet.kepler_name}</option>`;
        });
      });
  }
};

const submitLaunch = () => {
  const target = document.getElementById("planets-selector").value;
  const launchDate = new Date(document.getElementById("launch-day").value);
  const mission = document.getElementById("mission-name").value;
  const rocket = document.getElementById("rocket-name").value;
  const flightNumber = launches[launches.length - 1]?.flightNumber + 1 || 1;

  return fetch("/launches", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      launchDate: Math.floor(launchDate / 1000),
      flightNumber,
      mission,
      rocket,
      target,
    })
  })
  .then(() => {
    document.getElementById("launch-success").hidden = false;
  })
  .then(loadLaunches)
};

const abortLaunch = id => {
  return fetch(`/launches/${id}`, {
    method: "delete",
  })
  .then(loadLaunches)
  .then(listUpcoming)
};

const listUpcoming = () => {
  const upcomingList = document.getElementById("upcoming-list");
  // Container
  const containerEl = document.createElement("div");
  containerEl.classList.add(cssListContainer);
  // Heading
  const listHeadingEl = document.createElement("div");
  listHeadingEl.classList.add(cssListHeading);
  // Flight No.
  const noHeadEl = document.createElement("span");
  noHeadEl.classList.add(cssListHeadingItem, cssListNumber);
  noHeadEl.textContent = numberHeading;
  // Date
  const dateHeadEl = document.createElement("span");
  dateHeadEl.classList.add(cssListHeadingItem, cssListDate);
  dateHeadEl.textContent = dateHeading;
  // Mission
  const missionHeadEl = document.createElement("span");
  missionHeadEl.classList.add(cssListHeadingItem, cssListMission);
  missionHeadEl.textContent = missionHeading;
  // Rocket
  const rocketHeadEl = document.createElement("span");
  rocketHeadEl.classList.add(cssListHeadingItem,cssListRocket);
  rocketHeadEl.textContent = rocketHeading;
  // Destination
  const targetHeadEl = document.createElement("span");
  targetHeadEl.classList.add(cssListHeadingItem, cssListDestination);
  targetHeadEl.textContent = targetHeading;
  // Append to list heading
  listHeadingEl.append(noHeadEl, dateHeadEl, missionHeadEl, rocketHeadEl, targetHeadEl);
  // Body
  const listBodyEl = document.createElement("div");
  listBodyEl.classList.add(cssListBody);
  launches
    .filter((launch) => launch.upcoming)
    .forEach((launch) => {
      // Content
      const launchDate = new Date(launch.launchDate * 1000).toDateString();
      const flightNumber = String(launch.flightNumber); //.padEnd(3);
      const mission = launch.mission.slice(0, 25);//.padEnd(25);
      const rocket = launch.rocket;//.padEnd(22);
      const target = launch.target ?? "";
      // List Item
      const listItemEl = document.createElement("div");
      listItemEl.classList.add(cssListItem);
      // Flight No.
      const noBodyEl = document.createElement("span");
      noBodyEl.classList.add(cssListBodyItem, cssListNumber);
      const deleteItem = document.createElement("span");
      deleteItem.classList.add(cssDelete);
      deleteItem.textContent = "✖";
      deleteItem.setAttribute("onclick", `abortLaunch(${launch.flightNumber})`);
      noBodyEl.append(deleteItem, flightNumber);
      // Date
      const dateBodyEl = document.createElement("span");
      dateBodyEl.classList.add(cssListBodyItem, cssSilver, cssListDate);
      dateBodyEl.textContent = launchDate;
      // Mission
      const missionBodyEl = document.createElement("span");
      missionBodyEl.classList.add(cssListBodyItem, cssListMission);
      missionBodyEl.textContent = mission;
      // Rocket
      const rocketBodyEl = document.createElement("span");
      rocketBodyEl.classList.add(cssListBodyItem, cssSilver, cssListRocket);
      rocketBodyEl.textContent = rocket;
      // Destination
      const targetBodyEl = document.createElement("span");
      targetBodyEl.classList.add(cssListBodyItem, cssGold, cssListDestination);
      targetBodyEl.textContent = target ? target : "UnKnown";
      // Append to list item
      listItemEl.append(noBodyEl, dateBodyEl, missionBodyEl, rocketBodyEl, targetBodyEl);
      // Append to Body
      listBodyEl.append(listItemEl)
    });
    // Append to upcoming
    containerEl.append(listHeadingEl, listBodyEl);
    upcomingList.textContent = "";
    upcomingList.append(containerEl)
};

const listHistory = () => {
  const historyList = document.getElementById("history-list");
  // Container
  const containerEl = document.createElement("div");
  containerEl.classList.add(cssListContainer);
  // Heading
  const listHeadingEl = document.createElement("div");
  listHeadingEl.classList.add(cssListHeading);
  // Flight No.
  const noHeadEl = document.createElement("span");
  noHeadEl.classList.add(cssListHeadingItem, cssListNumber);
  noHeadEl.textContent = numberHeading;
  // Date
  const dateHeadEl = document.createElement("span");
  dateHeadEl.classList.add(cssListHeadingItem, cssListDate);
  dateHeadEl.textContent = dateHeading;
  // Mission
  const missionHeadEl = document.createElement("span");
  missionHeadEl.classList.add(cssListHeadingItem, cssListMission);
  missionHeadEl.textContent = missionHeading;
  // Rocket
  const rocketHeadEl = document.createElement("span");
  rocketHeadEl.classList.add(cssListHeadingItem,cssListRocket);
  rocketHeadEl.textContent = rocketHeading;
  // Customers
  const customersHeadEl = document.createElement("span");
  customersHeadEl.classList.add(cssListHeadingItem, cssListCustomers);
  customersHeadEl.textContent = customersHeading;
  // Append to list heading
  listHeadingEl.append(noHeadEl, dateHeadEl, missionHeadEl, rocketHeadEl, customersHeadEl);
  // Body
  const listBodyEl = document.createElement("div");
  listBodyEl.classList.add(cssListBody);
  launches
    .forEach((launch) => {
      // Content
      const cssSuccess = launch.success ? "success" : "failure";
      const launchDate = new Date(launch.launchDate * 1000).toDateString();
      const flightNumber = String(launch.flightNumber);//.padEnd(3);
      const mission = launch.mission.slice(0, 25);//.padEnd(25);
      const rocket = launch.rocket;//.padEnd(22);
      const customers = launch.customers.join(", ").slice(0, 27);
      // List Item
      const listItemEl = document.createElement("div");
      listItemEl.classList.add(cssListItem);
      // Flight No.
      const noBodyEl = document.createElement("span");
      noBodyEl.classList.add(cssListBodyItem, cssListNumber);
      const successItem = document.createElement("span");
      successItem.classList.add(cssSuccess);
      successItem.textContent = "█";
      noBodyEl.append(successItem, flightNumber);
      // Date
      const dateBodyEl = document.createElement("span");
      dateBodyEl.classList.add(cssListBodyItem, cssSilver, cssListDate);
      dateBodyEl.textContent = launchDate;
      // Mission
      const missionBodyEl = document.createElement("span");
      missionBodyEl.classList.add(cssListBodyItem, cssListMission);
      missionBodyEl.textContent = mission;
      // Rocket
      const rocketBodyEl = document.createElement("span");
      rocketBodyEl.classList.add(cssListBodyItem, cssSilver, cssListRocket);
      rocketBodyEl.textContent = rocket;
      // Customers
      const customersBodyEl = document.createElement("span");
      customersBodyEl.classList.add(cssListBodyItem, cssGold, cssListCustomers);
      customersBodyEl.textContent = customers ? customers : "UnKnown";
      // Append to list item
      listItemEl.append(noBodyEl, dateBodyEl, missionBodyEl, rocketBodyEl, customersBodyEl);
      // Append to Body
      listBodyEl.append(listItemEl)
    });
    // Append to History
    containerEl.append(listHeadingEl, listBodyEl);
    historyList.textContent = "";
    historyList.append(containerEl);
};

const navigate = navigateTo => {
  const pages = ["history", "upcoming", "launch"];
  document.getElementById(navigateTo).hidden = false;
  pages.filter(page => page !== navigateTo).forEach(page => {
    document.getElementById(page).hidden = true;
  })
  document.getElementById("launch-success").hidden = true;

  if (navigateTo === "upcoming") {
    console.log('yes')
    loadLaunches();
    listUpcoming();
  } else if (navigateTo === "history") {
    loadLaunches();
    listHistory();
  }
};

window.onload = () => {
  setVideo();
  initValues();
  loadLaunches();
  loadPlanets();
};
