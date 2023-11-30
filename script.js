let apiKey;
let planetData;
let clickedPlanet;

let currentClickedPlanet = document.querySelector(".planets__container");

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

currentClickedPlanet.addEventListener("click", (event) => {
  if (
    event.target.tagName === "A" &&
    event.target.classList.contains("clicked")
  ) {
    console.log(event.target.id);
    clickedPlanet = event.target.id;

    planetData.forEach((planetData) => {
      if (clickedPlanet == planetData.name) {
        console.log(planetData);
      }
    });
  }
});
