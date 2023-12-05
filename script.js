// Variables for storing and reusing API key, planetdata, the planet the user has clicked on and so on
let apiKey;
let planetData;
let clickedPlanet;
let currentClickedPlanet = document.querySelector(".main__content");

// Function that gets the API key
async function getApiKey() {
  try {
    // Fetch to /keys endpoint for the API key with the method POST
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Storing the key in data variable
    let data = await response.json();
    // Assigning the obtained key to the global apiKey variable
    apiKey = data.key;
  } catch (error) {
    // If there is an error when fetching this will console.log it
    console.log(error);
  }
}

// Calling the async function
getApiKey().then(() => {
  // Using the updated API key to fetch data from the api in an async function
  async function getData() {
    try {
      // Fetching data from api
      const response = await fetch(
        "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
        {
          method: "GET",
          headers: { "x-zocom": apiKey },
        }
      );
      // Storing the data from the api in a variable named data
      let data = await response.json();
      // Assinging the data about the planets in the global variable planetData
      planetData = data.bodies;
    } catch (error) {
      // If there is an error when fetching this will console.log it
      console.log(error);
    }
  }
  // Running the async fetch function
  getData();
});

// Handling the event of which planet was clicked
currentClickedPlanet.addEventListener("click", async (event) => {
  // When clicking on a planet it checks if the planet is an A tag or a section and if it has the class clicked it runs the next part
  if (
    (event.target.tagName === "A" || event.target.tagName === "SECTION") &&
    event.target.classList.contains("clicked")
  ) {
    // Taking the id of the clicked planet which is the planet name and storing it in a globale variable
    clickedPlanet = event.target.id;

    try {
      // Looks through all the planets in the data from the api, if ones name match the one in the clickedPlanet variable it stores it SelectedPlanet
      const selectedPlanet = planetData.find(
        (planet) => clickedPlanet === planet.name
      );

      if (selectedPlanet) {
        // Stores the selected planet data in localStorage
        localStorage.setItem("selectedPlanet", JSON.stringify(selectedPlanet));
      }
    } catch (error) {
      // If something wrong happens in the click event this will console.log it
      console.error("Error handling click event:", error);
    }
  }
});
// Function to update the elements with the planet information
function updatePlanetInfo(planetData) {
  // Getting all the elements to be updated
  const planetNameElement = document.getElementById("description__name");
  const planetLatinNameElement = document.getElementById(
    "description__latinName"
  );
  const planetDescriptionTextElement =
    document.getElementById("description__text");
  const planetCircumferenceElement = document.getElementById(
    "description__circumference"
  );
  const planetDistanceFromSun = document.getElementById(
    "description__distance"
  );
  const planetMaxTempElement = document.getElementById("description__maxTemp");
  const planetMinTempElement = document.getElementById("description__minTemp");
  const planetMoonsElement = document.getElementById("description__moon");

  // Updating all the HTML elements with the data about the planet from the api
  if (planetNameElement) {
    planetNameElement.innerText = planetData.name.toUpperCase();
    planetLatinNameElement.innerText = planetData.latinName.toUpperCase();
    planetDescriptionTextElement.innerText = planetData.desc;
    planetCircumferenceElement.innerText = planetData.circumference;
    planetDistanceFromSun.innerText = planetData.distance;
    planetMaxTempElement.innerText = planetData.temp.day;
    planetMinTempElement.innerText = planetData.temp.night;
    planetMoonsElement.innerText = planetData.moons;
  }
}

// Getting the data only when the HTML page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Retrieving the stored planet data from localStorage
  const storedPlanetData = localStorage.getItem("selectedPlanet");

  if (storedPlanetData) {
    // Parse the JSON string to get the planet object
    const planetData = JSON.parse(storedPlanetData);

    // Updating the HTML elements with the planet information
    updatePlanetInfo(planetData);

    // Clear the stored planet data from localStorage
    localStorage.removeItem("selectedPlanet");
  }
});
