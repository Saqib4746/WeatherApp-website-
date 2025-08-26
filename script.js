const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide');
const forecastContainer = document.querySelector('.forecast-container');

// Add event listener for Enter key
document.querySelector('.search-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        search.click();
    }
});

search.addEventListener('click', () => {
    const APIKey = '98740f4ebc0d63bc0f8ba70090e5a091';
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    // If the same city is searched again, don't do anything
    if (cityHide.textContent === city) {
        return;
    }

    // Add fade-out animation to current weather data
    const weatherElements = [
        document.querySelector('.weather-box img'),
        document.querySelector('.weather-box .temperature'),
        document.querySelector('.weather-box .description'),
        document.querySelector('.weather-details .humidity span'),
        document.querySelector('.weather-details .wind span'),
        ...document.querySelectorAll('.forecast-day')
    ];
    
    weatherElements.forEach(element => {
        if (element) {
            element.classList.add('fade-out');
        }
    });

    // Fetch new weather data after fade-out animation
    setTimeout(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
            .then(response => response.json())
            .then(json => {
                if (json.cod === '404') {
                    cityHide.textContent = city;
                    container.style.height = '400px';
                    weatherBox.classList.remove('active');
                    weatherDetails.classList.remove('active');
                    forecastContainer.classList.remove('active');
                    error404.classList.add('active');
                    return;
                }

                // Update city hide text
                cityHide.textContent = city;

                // Remove active classes first for clean transition
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.remove('active');
                forecastContainer.classList.remove('active');
                container.classList.remove('active');

                // Set appropriate container height
                container.style.height = '650px';

                const image = document.querySelector('.weather-box img');
                const temperature = document.querySelector('.weather-box .temperature');
                const description = document.querySelector('.weather-box .description');
                const humidity = document.querySelector('.weather-details .humidity span');
                const wind = document.querySelector('.weather-details .wind span');

                // Remove fade-out class
                weatherElements.forEach(element => {
                    if (element) {
                        element.classList.remove('fade-out');
                    }
                });

                // Change image based on weather condition
                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'images/clear.png';
                        break;
                    case 'Rain':
                        image.src = 'images/rain.png';
                        break;
                    case 'Snow':
                        image.src = 'images/snow.png';
                        break;
                    case 'Clouds':
                        image.src = 'images/cloud.png';
                        break;
                    case 'Mist':
                    case 'Haze':
                    case 'Fog':
                        image.src = 'images/mist.png';
                        break;
                    default:
                        image.src = 'images/cloud.png';
                }

                // Update weather data
                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

                // Generate mock forecast data (in a real app, you'd fetch this from an API)
                generateForecastData();

                // Add active class to show content with transitions
                setTimeout(() => {
                    container.classList.add('active');
                    weatherBox.classList.add('active');
                    weatherDetails.classList.add('active');
                    forecastContainer.classList.add('active');
                }, 50);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                cityHide.textContent = city;
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                forecastContainer.classList.remove('active');
                error404.classList.add('active');
            });
    }, 500); // Wait for fade-out animation to complete
});

// Function to generate mock forecast data
function generateForecastData() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecastDays = document.querySelectorAll('.forecast-day');
    const today = new Date();
    
    forecastDays.forEach((dayElem, index) => {
        const dayIndex = (today.getDay() + index + 1) % 7;
        const dayName = days[dayIndex];
        const temp = Math.floor(Math.random() * 15) + 15; // Random temp between 15-30°C
        
        // Set random weather condition
        const weatherConditions = ['clear', 'cloud', 'rain', 'snow'];
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        dayElem.querySelector('.day').textContent = dayName;
        dayElem.querySelector('img').src = `images/${randomCondition}.png`;
        dayElem.querySelector('.forecast-temp').textContent = `${temp}°C`;
    });
}

// Initialize with some forecast data
generateForecastData();