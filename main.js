const form = document.getElementById('form');

form.addEventListener('submit', 
    
    async (event) => {
    event.preventDefault();

    const place = document.getElementById('place').value;
    const state = document.getElementById('state').value;
    const weatherstack = `https://api.weatherstack.com/current?access_key=7f73392e905b5ffa0aca9b882bd55f3c&query=${encodeURIComponent(place + ', ' + state)}`;
    

    const weather_data = document.getElementById('weather');
    const clothes = document.getElementById("clothes");
    const outfit = document.getElementById("outfit");
    var clothing_suggestion = "";
    var clothes_pic = "";
    var rain_snow = "";

    const res = await fetch(weatherstack);
    const data = await res.json();

    const location = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    const weather = data.current;
    const lat = data.location.lat;
    const lon = data.location.lon;

    await fetch('http://localhost:3005/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            place: place.toLowerCase(),
            latitude: lat,
            longitude: lon
        })
    });

    const condition = weather.weather_descriptions[0]
    const temp = weather.temperature
    const feels = weather.feelslike
    const uv = weather.uv_index
    const humid = weather.humidity
    const speed = weather.wind_speed
    const icon = weather.weather_icons[0]

    

    const aqres = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`);
    const aqdata = await aqres.json();
    const air_quality = aqdata.current.us_aqi;



    if (air_quality <= 50) {
        aq_suggestion = "Go outside! The air quality is good!";
    } else if (air_quality <= 100) {
        aq_suggestion = "Go outside! The air quality is moderate!";
    } else if (air_quality <= 150) {
        aq_suggestion = "Be hesitant when going outside because air quality can be unhealthy for sensitive people";
    } else {
        aq_suggestion = "It is recommended that you stay indoors as the air quality can be harmful";
    }



    weather_data.innerHTML = `
        <h2>Current Weather in ${location}</h2>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Temperature:</strong> ${temp} degrees C</p>
        <p><strong>Feels Like:</strong> ${feels} degrees C</p>
        <p><strong>UV Index:</strong> ${uv}</p>
        <p><strong>Humidity:</strong> ${humid} %</p>
        <p><strong>Wind Speed:</strong> ${speed} KM/H</p>
        <p><strong>Air Quality Index:</strong> ${air_quality}</p>
        <p> ${aq_suggestion} <p>
        <img src="${icon}">
    `;


    

    if (weather.temperature >= 20) {
        clothing_suggestion = "We suggest you wear shorts and a T-shirt as it's warm outside";
        clothes_pic = "https://img.freepik.com/free-photo/man-white-t-shirt-blue-shorts-with-design-space-full-body_53876-102130.jpg"; 

    } else if (weather.temperature >= 10) {
        clothing_suggestion = "We suggest you wear a light jacket or long sleeves and some pant as it's mild temperatures outside.";
        clothes_pic = "https://media.istockphoto.com/id/1358427473/photo/full-length-portrait-of-standing-young-handsome-caucasian-man-looking-at-camera-in-isolated.jpg?s=612x612&w=0&k=20&c=xXHDeqV_qFDgopyjp7_f3ReXkoepezUTYVwrdOnNIRQ=";
    
    } else if (weather.temperature >= 5) {
        clothing_suggestion = "We suggest you wear a coat, sweathsirt or sweater as it's chilly outside";
        clothes_pic = "https://img.freepik.com/premium-photo/attractive-stylish-man-wearing-white-sweatshirt-sweatpants-standing-blue-studio-background_105609-8038.jpg";
    
    } else {
        clothing_suggestion = "We suggest you wear a heavy coat, a hate, and a pair of gloves as it's cold outside.";
        clothes_pic = "https://i.ebayimg.com/images/g/AA0AAOSwDEtaOT7F/s-l1200.jpg";
    }


    if (condition.includes("Rain")) {
        clothing_suggestion += " It's also raining so bring an umbrella or wear a raincoat!";
        rain_snow = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxFCAJk1HWjMBKZR1IUmnz0MAnoNwYTT21A&s";
    
    } else if (condition.includes("Snow")) {
        clothing_suggestion += " It's also snowing so wear some snow boots!";
        rain_snow = "https://www.switchbacktravel.com/sites/default/files/articles%20/Winter%20Boots%20%28Sorel%20Caribou%20in%20snow%20-%20m%29.jpg"; 
    }

    

    var images = `<img src="${clothes_pic}">`;

    if (rain_snow) {
        images += `<img src="${rain_snow}">`;
    }

    clothes.textContent = clothing_suggestion;
    outfit.innerHTML = images;

    document.getElementById('map').innerHTML = ""; 

    map = L.map("map").setView([lat, lon], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong>City: </strong>${location}<br>
            <strong>Condition: </strong>${condition}<br>
            <strong>Temperature: </strong> ${temp} degrees C`)
        .openPopup();

    const getlatlon = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    const latlon = await getlatlon.json();
    const getforecast = await fetch(latlon.properties.forecastHourly);
    const forecast = await getforecast.json();
    const periods = forecast.properties.periods.slice(0, 12);

    const labels = periods.map(period => {
        const date = new Date(period.startTime);
        return date.toLocaleTimeString([], { 
            hour: 'numeric', 
            hour12: true 
        });
    });

    const temp_data = periods.map(period => (
        (period.temperature - 32) * 5 / 9).toFixed(1)
    );

    document.getElementById("12hrfc").style.display = "block";


    var forecastgraph;

    if (forecastgraph) {

        forecastgraph.data.labels = labels;
        forecastgraph.data.datasets[0].data = temp_data;
        forecastgraph.update();

    } else {

        const fc = document.getElementById('canvas').getContext('2d');
        forecastgraph = new Chart(fc, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature forecast in celcius',
                    data: temp_data,
                    fill: false,
                    borderColor: 'black',
                }]
            },
        });
    }
});