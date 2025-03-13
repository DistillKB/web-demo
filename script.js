document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const cityInput = document.getElementById('cityInput');
    const weatherInfo = document.getElementById('weatherInfo');
    const errorMessage = document.getElementById('errorMessage');

    searchButton.addEventListener('click', getWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });

    function getWeather() {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        hideError();
        weatherInfo.style.display = 'none';

        fetch(`https://fi7.bot-hosting.net:22374/weather?city=${encodeURIComponent(city)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    showError(data.error);
                } else {
                    displayWeather(data.data);
                }
            })
            .catch(error => {
                showError('Error fetching weather data. Please try again later.');
                console.error('Error:', error);
            });
    }

    function displayWeather(weatherData) {
		const { main, weather, name, sys, wind } = weatherData;
		const temperature = main.temp;
		const description = weather[0].description;
		const country = sys.country;
		const humidity = main.humidity;
		const pressure = main.pressure;
		const windSpeed = wind.speed;
		const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
		const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
	
		weatherInfo.innerHTML = `
			<h2>Weather in ${name}, ${country}</h2>
			<p>Temperature: ${temperature}°C</p>
			<p>Conditions: ${description}</p>
			<p>Humidity: ${humidity}%</p>
			<p>Pressure: ${pressure} hPa</p>
			<p>Wind Speed: ${windSpeed} m/s</p>
			<p>Sunrise: ${sunrise}</p>
			<p>Sunset: ${sunset}</p>
		`;
		weatherInfo.style.display = 'block';
	}

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});
