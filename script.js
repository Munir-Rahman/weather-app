const city = document.querySelector("#city");
const btn = document.querySelector("button");
const weather_result = document.querySelector(".wheather-result");

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    wheather(); // call function on click
});

const wheather = async () => {
    const cityName = city.value.trim(); // ✅ fix: get the value of the input

    weather_result.classList.remove("hide");

    if (!cityName) {
        weather_result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    // ✅ fix: first get coordinates using Geocoding API
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=283f0adace65586ce34b92c209761ccd`;

    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            weather_result.innerHTML = "<p>City not found.</p>";
            return;
        }

        const { lat, lon } = geoData[0]; // ✅ fix: get lat/lon

        // ✅ fix: now use those coordinates to get weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=283f0adace65586ce34b92c209761ccd&units=metric`;
        const response = await fetch(weatherUrl);

        if (!response.ok) {
            throw new Error("Weather data not found.");
        }

        const data = await response.json();

        const result = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].main}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;

        weather_result.innerHTML = result;

    } catch (error) {
        weather_result.innerHTML = `<p>${error.message}</p>`;
    }
};
