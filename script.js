let apiKey;
let planetData;
let clickedPlanet;
let currentClickedPlanet = document.querySelector(".main__content");

async function getApiKey() {
  try {
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = await response.json();
    // Assign the obtained key to the global apiKey variable
    apiKey = data.key;
  } catch (error) {
    console.log(error);
  }
}

// Call the async function
getApiKey().then(() => {
  // The apiKey is now updated, and you can use it here

  async function getData() {
    try {
      const response = await fetch(
        "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
        {
          method: "GET",
          headers: { "x-zocom": apiKey },
        }
      );

      let data = await response.json();
      planetData = data.bodies;
      console.log(planetData);
    } catch (error) {
      console.log(error);
    }
  }

  getData();
});

currentClickedPlanet.addEventListener("click", async (event) => {
  if (
    (event.target.tagName === "A" || event.target.tagName === "SECTION") &&
    event.target.classList.contains("clicked")
  ) {
    console.log(event.target.id);
    clickedPlanet = event.target.id;

    try {
      const selectedPlanet = planetData.find(
        (planet) => clickedPlanet === planet.name
      );

      if (selectedPlanet) {
        // Store the selected planet data in localStorage
        localStorage.setItem("selectedPlanet", JSON.stringify(selectedPlanet));

        // Redirect to the other HTML page
        window.location.href = "planet.html";
      }
    } catch (error) {
      console.error("Error handling click event:", error);
    }
  }
});

function updatePlanetInfo(planetData) {
  // Update the elements with the planet information
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

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the stored planet data from localStorage
  const storedPlanetData = localStorage.getItem("selectedPlanet");

  if (storedPlanetData) {
    // Parse the JSON string to get the planet object
    const planetData = JSON.parse(storedPlanetData);
    // console.log(storedPlanetData);

    // Update the elements with the planet information
    updatePlanetInfo(planetData);

    // Clear the stored planet data from localStorage
    localStorage.removeItem("selectedPlanet");
  } else {
    // console.error("No planet data found in localStorage.");
  }
});
