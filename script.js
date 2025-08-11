document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT: Paste your OpenWeatherMap API Key here ---
    const apiKey = "5209fcf401c5048ac70e1bd6b9984cfc";
    
    // Main App Container
    const appContainer = document.getElementById('app-container');

    // DOM Element Selectors
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    const errorDisplay = document.querySelector('.error-message');
    
    // Weather display selectors
    const cityNameEl = document.querySelector('.city-name');
    const weatherDescEl = document.querySelector('.weather-description');
    const tempEl = document.querySelector('.temperature');
    const iconEl = document.querySelector('.weather-icon-large');
    const humidityEl = document.querySelector('.humidity');
    const windEl = document.querySelector('.wind');
    const feelsLikeEl = document.querySelector('.feels-like');

    const fetchWeather = async (city) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            
            // If this is the first successful search, transition the layout
            if (appContainer.classList.contains('initial-state')) {
                appContainer.classList.remove('initial-state');
                appContainer.classList.add('active-state');
            }

            errorDisplay.style.display = 'none'; // Hide error on success
            updateWeatherDisplay(data);

        } catch (error) {
            console.error('Fetch error:', error);
            // Only show error if the dashboard is already active
            if (appContainer.classList.contains('active-state')) {
                errorDisplay.style.display = 'block';
            }
        }
    };

    const updateWeatherDisplay = (data) => {
        cityNameEl.textContent = data.name;
        weatherDescEl.textContent = data.weather[0].description;
        tempEl.textContent = `${Math.round(data.main.temp)}°`;
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        iconEl.alt = data.weather[0].description;
        humidityEl.textContent = `${data.main.humidity}%`;
        windEl.textContent = `${data.wind.speed.toFixed(1)} km/h`;
        feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°`;
    };

    const handleSearch = () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
            searchInput.value = ''; // Clear input field
        }
    };

    // --- SCRIPT INITIALIZATION ---

    // Set the initial state on page load
    appContainer.classList.add('initial-state');

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
});