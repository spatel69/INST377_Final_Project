
let map;
let marker;
let forecastChart;

const form = document.getElementById('weather-form');
const resultDiv = document.getElementById('weather-result');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const place = document.getElementById('place').value;
    const weatherstack = `https://api.weatherstack.com/current?access_key=b5db998e3a7a4b4295cb9a2101259c61&query=${encodeURIComponent(place)}`;

    try {
        const response = await fetch(weatherstack);
        const data = await response.json();



        const location = `${data.location.name}, ${data.location.country}`;
        const weather = data.current;
        const lat = data.location.lat;
        const lon = data.location.lon;

        // Show current weather
        resultDiv.innerHTML = `
        <h2>Current Weather in ${location}</h2>
        <p><strong>Condition:</strong> ${weather.weather_descriptions[0]}</p>
        <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
        <p><strong>Feels Like:</strong> ${weather.feelslike}°C</p>
        <p><strong>UV Index:</strong> ${weather.uv_index}</p>
        <p><strong>Humidity:</strong> ${weather.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${weather.wind_speed} km/h</p>
        <img src="${weather.weather_icons[0]}" alt="Weather icon">
    `;

        // Clothing suggestion + outfit image
        const suggestionDiv = document.getElementById("clothing-suggestion");
        const outfitImageDiv = document.getElementById("outfit-image");

        let suggestion = "";
        let baseOutfitImg = "";
        let extraConditionImg = "";

        // Base outfit by temperature
        if (weather.temperature >= 25) {
            suggestion = "We suggest you wear shorts and a T-shirt as it's warm outside";
            baseOutfitImg = "https://img.freepik.com/free-photo/man-white-t-shirt-blue-shorts-with-design-space-full-body_53876-102130.jpg"; 
        } else if (weather.temperature >= 15) {
            suggestion = "We suggest you wear a light jacket or long sleeves and some pant as it's mild temperatures outside.";
            baseOutfitImg = "https://media.istockphoto.com/id/1358427473/photo/full-length-portrait-of-standing-young-handsome-caucasian-man-looking-at-camera-in-isolated.jpg?s=612x612&w=0&k=20&c=xXHDeqV_qFDgopyjp7_f3ReXkoepezUTYVwrdOnNIRQ=";
        } else if (weather.temperature >= 5) {
            suggestion = "We suggest you wear a coat, sweathsirt or sweater as it's chilly outside";
            baseOutfitImg = "https://img.freepik.com/premium-photo/attractive-stylish-man-wearing-white-sweatshirt-sweatpants-standing-blue-studio-background_105609-8038.jpg";
        } else {
            suggestion = "We suggest you wear a heavy coat, a hat, and a pair of gloves as it's cold outside.";
            baseOutfitImg = "https://i.ebayimg.com/images/g/AA0AAOSwDEtaOT7F/s-l1200.jpg";
        }

        // Add condition-based suggestions and images
        const condition = weather.weather_descriptions[0].toLowerCase();
        if (condition.includes("rain")) {
            suggestion += " Don't forget an umbrella or raincoat.";
            extraConditionImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxFCAJk1HWjMBKZR1IUmnz0MAnoNwYTT21A&s";
        } else if (condition.includes("snow")) {
            suggestion += " Wear boots and winter accessories.";
            extraConditionImg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/…"; 
        }

        // Display text and one or two images
        suggestionDiv.textContent = suggestion;

        let imageHtml = `<img src="${baseOutfitImg}" alt="Base Outfit">`;
        if (extraConditionImg) {
            imageHtml += `<img src="${extraConditionImg}" alt="Condition Outfit">`;
        }

        outfitImageDiv.innerHTML = imageHtml;

        // Map setup
        if (!map) {
            map = L.map('map').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lon], 10);
            if (marker) marker.remove();
        }

        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<strong>${location}</strong><br>${weather.weather_descriptions[0]}, ${weather.temperature}°C`)
            .openPopup();

        // Forecast from NWS
        const pointRes = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
        const pointData = await pointRes.json();
        const forecastHourlyUrl = pointData.properties.forecastHourly;
        const forecastRes = await fetch(forecastHourlyUrl);
        const forecastData = await forecastRes.json();

        const periods = forecastData.properties.periods.slice(0, 12);
        const labels = periods.map(p => {
            const date = new Date(p.startTime);
            let hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours} ${ampm}`;
        });
        const temps = periods.map(p => p.temperature);

        // Chart
        if (forecastChart) {
            forecastChart.data.labels = labels;
            forecastChart.data.datasets[0].data = temps;
            forecastChart.update();
        } else {
            const ctx = document.getElementById('forecast-chart').getContext('2d');
            forecastChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature Forecast (°F)',
                        data: temps,
                        fill: false,
                        borderColor: 'blue',
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Next 12 Hours Temperature'
                        }
                    }
                }
            });
        }

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">Fetch Error: ${error.message}</p>`;
    }
});







// let map;
// let marker;
// let forecastChart;
// const form = document.getElementById('form');

// form.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const place = document.getElementById('place').value;
//     const weatherstack = `https://api.weatherstack.com/current?access_key=b5db998e3a7a4b4295cb9a2101259c61&query=${encodeURIComponent(place)}`;
    

//     const weather_data = document.getElementById('weather');

//     const res = await fetch(weatherstack);
//     const data = await res.json();

//     const location = `${data.location.name}, ${data.location.country}`;
//     const weather = data.current;
//     const lat = data.location.lat;
//     const lon = data.location.lon;

//     weather_data.innerHTML = `
//         <h2>Current Weather in ${location}</h2>
//         <p><strong>Condition:</strong> ${weather.weather_descriptions[0]}</p>
//         <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
//         <p><strong>Feels Like:</strong> ${weather.feelslike}°C</p>
//         <p><strong>UV Index:</strong> ${weather.uv_index}</p>
//         <p><strong>Humidity:</strong> ${weather.humidity}%</p>
//         <p><strong>Wind Speed:</strong> ${weather.wind_speed} km/h</p>
//         <img src="${weather.weather_icons[0]}" alt="Weather icon">
//     `;

//     const suggestionDiv = document.getElementById("clothing-suggestion");
//     const outfitImageDiv = document.getElementById("outfit-image");

//     let suggestion = "";
//     let baseOutfitImg = "";
//     let extraConditionImg = "";

//     if (weather.temperature >= 25) {
//         suggestion = "We suggest you wear shorts and a T-shirt as it's warm outside";
//         baseOutfitImg = "https://img.freepik.com/free-photo/man-white-t-shirt-blue-shorts-with-design-space-full-body_53876-102130.jpg"; 
//     } else if (weather.temperature >= 15) {
//         suggestion = "We suggest you wear a light jacket or long sleeves and some pant as it's mild temperatures outside.";
//         baseOutfitImg = "https://media.istockphoto.com/id/1358427473/photo/full-length-portrait-of-standing-young-handsome-caucasian-man-looking-at-camera-in-isolated.jpg?s=612x612&w=0&k=20&c=xXHDeqV_qFDgopyjp7_f3ReXkoepezUTYVwrdOnNIRQ=";
//     } else if (weather.temperature >= 5) {
//         suggestion = "We suggest you wear a coat, sweathsirt or sweater as it's chilly outside";
//         baseOutfitImg = "https://img.freepik.com/premium-photo/attractive-stylish-man-wearing-white-sweatshirt-sweatpants-standing-blue-studio-background_105609-8038.jpg";
//     } else {
//         suggestion = "We suggest you wear a heavy coat, a hate, and a pair of gloves as it's cold outside.";
//         baseOutfitImg = "https://i.ebayimg.com/images/g/AA0AAOSwDEtaOT7F/s-l1200.jpg";
//     }

//     const condition = weather.weather_descriptions[0].toLowerCase();
//     if (condition.includes("rain")) {
//         suggestion += " Don't forget an umbrella or raincoat.";
//         extraConditionImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxFCAJk1HWjMBKZR1IUmnz0MAnoNwYTT21A&s";
//     } else if (condition.includes("snow")) {
//         suggestion += " Wear boots and winter accessories.";
//         extraConditionImg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/…"; 
//     }

//     suggestionDiv.textContent = suggestion;

//     let imageHtml = `<img src="${baseOutfitImg}" alt="Base Outfit">`;
//     if (extraConditionImg) {
//         imageHtml += `<img src="${extraConditionImg}" alt="Condition Outfit">`;
//     }

//     outfitImageDiv.innerHTML = imageHtml;

//     if (!map) {
//         map = L.map('map').setView([lat, lon], 10);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors'
//         }).addTo(map);
//     } else {
//         map.setView([lat, lon], 10);
//         if (marker) marker.remove();
//     }

//     marker = L.marker([lat, lon]).addTo(map)
//         .bindPopup(`<strong>${location}</strong><br>${weather.weather_descriptions[0]}, ${weather.temperature}°C`)
//         .openPopup();

//     const pointRes = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
//     const pointData = await pointRes.json();
//     const forecastHourlyUrl = pointData.properties.forecastHourly;
//     const forecastRes = await fetch(forecastHourlyUrl);
//     const forecastData = await forecastRes.json();

//     const periods = forecastData.properties.periods.slice(0, 12);
//     const labels = periods.map(p => {
//         const date = new Date(p.startTime);
//         let hours = date.getHours();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12 || 12;
//         return `${hours} ${ampm}`;
//     });
//     const temps = periods.map(p => p.temperature);

//     if (forecastChart) {
//         forecastChart.data.labels = labels;
//         forecastChart.data.datasets[0].data = temps;
//         forecastChart.update();
//     } else {
//         const ctx = document.getElementById('forecast-chart').getContext('2d');
//         forecastChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Temperature Forecast (°F)',
//                     data: temps,
//                     fill: false,
//                     borderColor: 'blue',
//                     tension: 0.3
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Next 12 Hours Temperature'
//                     }
//                 }
//             }
//         });
//     }
// });
