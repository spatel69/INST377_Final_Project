

// const form = document.getElementById('form');

// form.addEventListener('submit', 
    
//     async (event) => {
//     event.preventDefault();

//     const place = document.getElementById('place').value;
//     const weatherstack = `https://api.weatherstack.com/current?access_key=b5db998e3a7a4b4295cb9a2101259c61&query=${encodeURIComponent(place)}`;
    

//     const weather_data = document.getElementById('weather');
//     const clothes = document.getElementById("clothes");
//     const outfit = document.getElementById("outfit");
//     var clothing_suggestion = "";
//     var clothes_pic = "";
//     var rain_snow = "";

//     const res = await fetch(weatherstack);
//     const data = await res.json();

//     const location = `${data.location.name}, ${data.location.country}`;
//     const weather = data.current;
//     const lat = data.location.lat;
//     const lon = data.location.lon;

//     const condition = weather.weather_descriptions[0]
//     const temp = weather.temperature
//     const feels = weather.feelslike
//     const uv = weather.uv_index
//     const humid = weather.humidity
//     const speed = weather.wind_speed
//     const icon = weather.weather_icons[0]



//     weather_data.innerHTML = `
//         <h2>Current Weather in ${location}</h2>
//         <p><strong>Condition:</strong> ${condition}</p>
//         <p><strong>Temperature:</strong> ${temp} degrees C</p>
//         <p><strong>Feels Like:</strong> ${feels} degrees C</p>
//         <p><strong>UV Index:</strong> ${uv}</p>
//         <p><strong>Humidity:</strong> ${humid} %</p>
//         <p><strong>Wind Speed:</strong> ${speed} KM/H</p>
//         <img src="${icon}">
//     `;

//     if (weather.temperature >= 20) {
//         clothing_suggestion = "We suggest you wear shorts and a T-shirt as it's warm outside";
//         clothes_pic = "https://img.freepik.com/free-photo/man-white-t-shirt-blue-shorts-with-design-space-full-body_53876-102130.jpg"; 

//     } else if (weather.temperature >= 10) {
//         clothing_suggestion = "We suggest you wear a light jacket or long sleeves and some pant as it's mild temperatures outside.";
//         clothes_pic = "https://media.istockphoto.com/id/1358427473/photo/full-length-portrait-of-standing-young-handsome-caucasian-man-looking-at-camera-in-isolated.jpg?s=612x612&w=0&k=20&c=xXHDeqV_qFDgopyjp7_f3ReXkoepezUTYVwrdOnNIRQ=";
    
//     } else if (weather.temperature >= 5) {
//         clothing_suggestion = "We suggest you wear a coat, sweathsirt or sweater as it's chilly outside";
//         clothes_pic = "https://img.freepik.com/premium-photo/attractive-stylish-man-wearing-white-sweatshirt-sweatpants-standing-blue-studio-background_105609-8038.jpg";
    
//     } else {
//         clothing_suggestion = "We suggest you wear a heavy coat, a hate, and a pair of gloves as it's cold outside.";
//         clothes_pic = "https://i.ebayimg.com/images/g/AA0AAOSwDEtaOT7F/s-l1200.jpg";
//     }


//     if (condition.includes("Rain")) {
//         clothing_suggestion += " It's also raining so bring an umbrella or wear a raincoat!";
//         rain_snow = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxFCAJk1HWjMBKZR1IUmnz0MAnoNwYTT21A&s";
    
//     } else if (condition.includes("Snow")) {
//         clothing_suggestion += " It's also snowing so wear some snow boots!";
//         rain_snow = "https://www.switchbacktravel.com/sites/default/files/articles%20/Winter%20Boots%20%28Sorel%20Caribou%20in%20snow%20-%20m%29.jpg"; 
//     }

    

//     var images = `<img src="${clothes_pic}">`;

//     if (rain_snow) {
//         images += `<img src="${rain_snow}">`;
//     }

//     clothes.textContent = clothing_suggestion;
//     outfit.innerHTML = images;

//     document.getElementById('map').innerHTML = ""; 

//     map = L.map("map").setView([lat, lon], 12);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     }).addTo(map);


//     marker = L.marker([lat, lon]).addTo(map)
//         .bindPopup(`<strong>City: </strong>${location}<br>
//             <strong>Condition: </strong>${condition}<br>
//             <strong>Temperature: </strong> ${temp} degrees C`)
//         .openPopup();

//     const pointRes = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
//     const pointData = await pointRes.json();
//     const forecastHourlyUrl = pointData.properties.forecastHourly;
//     const forecastRes = await fetch(forecastHourlyUrl);
//     const forecastData = await forecastRes.json();

//     // async function getHourlyForecast(lat, lon) {

//     //     const pointRes = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
//     //     const pointData = await pointRes.json();

//     //     const forecastHourlyUrl = pointData.properties.forecastHourly;
//     //     const forecastRes = await fetch(forecastHourlyUrl);
//     //     const forecastData = await forecastRes.json();

//     //     return forecastData.properties.periods.slice(0, 12); // first 12 hours
//     // }


//     const periods = forecastData.properties.periods.slice(0, 12);
//     const labels = periods.map(p => {
//         const date = new Date(p.startTime);
//         let hours = date.getHours();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12 || 12;
//         return `${hours} ${ampm}`;
//     });
//     const temps = periods.map(p => p.temperature);

//     var forecastChart;

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
//                     borderColor: 'black',
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


const form = document.getElementById('form');

// Initialize forecast chart outside so we can reuse it
let forecastChart;

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const place = document.getElementById('place').value;
    const weatherstack = `https://api.weatherstack.com/current?access_key=b5db998e3a7a4b4295cb9a2101259c61&query=${encodeURIComponent(place)}`;

    const weather_data = document.getElementById('weather');
    const clothes = document.getElementById("clothes");
    const outfit = document.getElementById("outfit");

    let clothing_suggestion = "";
    let clothes_pic = "";
    let rain_snow = "";

    const res = await fetch(weatherstack);
    const data = await res.json();

    const location = `${data.location.name}, ${data.location.country}`;
    const weather = data.current;
    const lat = data.location.lat;
    const lon = data.location.lon;

    const condition = weather.weather_descriptions[0];
    const temp = weather.temperature;
    const feels = weather.feelslike;
    const uv = weather.uv_index;
    const humid = weather.humidity;
    const speed = weather.wind_speed;
    const icon = weather.weather_icons[0];

    weather_data.innerHTML = `
        <h2>Current Weather in ${location}</h2>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Feels Like:</strong> ${feels}°C</p>
        <p><strong>UV Index:</strong> ${uv}</p>
        <p><strong>Humidity:</strong> ${humid}%</p>
        <p><strong>Wind Speed:</strong> ${speed} km/h</p>
        <img src="${icon}" alt="Weather Icon">
    `;

    // Clothing recommendation
    if (temp >= 20) {
        clothing_suggestion = "We suggest you wear shorts and a T-shirt as it's warm outside.";
        clothes_pic = "https://img.freepik.com/free-photo/man-white-t-shirt-blue-shorts-with-design-space-full-body_53876-102130.jpg";
    } else if (temp >= 10) {
        clothing_suggestion = "We suggest you wear a light jacket or long sleeves and pants as it's mild outside.";
        clothes_pic = "https://media.istockphoto.com/id/1358427473/photo/full-length-portrait-of-standing-young-handsome-caucasian-man-looking-at-camera-in-isolated.jpg";
    } else if (temp >= 5) {
        clothing_suggestion = "We suggest you wear a coat, sweatshirt or sweater as it's chilly outside.";
        clothes_pic = "https://img.freepik.com/premium-photo/attractive-stylish-man-wearing-white-sweatshirt-sweatpants-standing-blue-studio-background_105609-8038.jpg";
    } else {
        clothing_suggestion = "We suggest you wear a heavy coat, hat, and gloves as it's cold outside.";
        clothes_pic = "https://i.ebayimg.com/images/g/AA0AAOSwDEtaOT7F/s-l1200.jpg";
    }

    if (condition.includes("Rain")) {
        clothing_suggestion += " It's also raining, so bring an umbrella or raincoat!";
        rain_snow = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxFCAJk1HWjMBKZR1IUmnz0MAnoNwYTT21A&s";
    } else if (condition.includes("Snow")) {
        clothing_suggestion += " It's also snowing, so wear some snow boots!";
        rain_snow = "https://www.switchbacktravel.com/sites/default/files/articles%20/Winter%20Boots%20%28Sorel%20Caribou%20in%20snow%20-%20m%29.jpg";
    }

    let images = `<img src="${clothes_pic}">`;
    if (rain_snow) {
        images += `<img src="${rain_snow}">`;
    }

    clothes.textContent = clothing_suggestion;
    outfit.innerHTML = images;

    // Replace map each time
    document.getElementById('map').innerHTML = "";
    const map = L.map("map").setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong>City:</strong> ${location}<br><strong>Condition:</strong> ${condition}<br><strong>Temp:</strong> ${temp}°C`)
        .openPopup();

    // NOAA forecast fetch
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

    const temps = periods.map(p => ((p.temperature - 32) * 5 / 9).toFixed(1)); // Convert to °C

    // Replace forecast chart canvas
    const container = document.querySelector('.map-chart-container');
    document.getElementById('forecast-chart')?.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'forecast-chart';
    container.appendChild(newCanvas);

    const ctx = newCanvas.getContext('2d');
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Forecast (°C)',
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
});
