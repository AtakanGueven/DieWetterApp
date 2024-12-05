document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Bitte geben Sie eine Stadt ein!');
    }
});

document.getElementById('city-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Standardverhalten
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert('Bitte geben Sie eine Stadt ein!');
        }
    }
});

function getWeather(city) {
    const apiKey = '99968ce89f39c0365fd7b6eeecf66578'; // Dein API-Schlüssel
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=de&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=de&appid=${apiKey}`;

    Promise.all([
        fetch(weatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([weatherData, forecastData]) => {
        displayWeather(weatherData);
        displayForecast(forecastData);
    })
    .catch(error => {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    });
}

function displayWeather(data) {
    const cityName = `${data.name}, ${data.sys.country}`; // Stadtname und Land
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `${data.main.temp}°C`;
    document.getElementById('humidity').textContent = `Luftfeuchtigkeit: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Windgeschwindigkeit: ${data.wind.speed} km/h`;
    document.getElementById('rain-chance').textContent = `Regenwahrscheinlichkeit: ${data.rain ? data.rain['1h'] : 0}%`; // Nutzung der "rain"-Eigenschaft aus den aktuellen Wetterdaten

    // Wetteranzeige anzeigen
    document.getElementById('weather-info').style.display = 'block';
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Vorherige Vorhersagen entfernen

    // Filtere die Daten nach täglichen Vorhersagen (z.B. 12:00 Uhr)
    const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    forecastList.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(item.dt * 1000);
        const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        forecastItem.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Wetter Icon">
            <div>
                <p>${dateString}</p>
                <p>${item.main.temp}°C</p>
                <p>Regen: ${item.pop * 100}%</p>
            </div>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}
