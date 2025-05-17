# INST377_Final_Project - Weatherwear

## Project Description

**Link to Deployed App:** https://inst-377-final-project-ten.vercel.app/
**Link to Deployed App Database Table:** https://inst-377-final-project-ten.vercel.app/locations


Weatherwear is a fully functional web app that aids users with clothing suggestions based on the weather data in the city that they search. When the user inputs a city and a state in the US, they will be able to see several real-time weather elements, a 12-hour forecast, and air quality. Given all of this data, the user will then get several clothing recommendations as well as a suggestions if they should go outdoors. The weather data is collected from three different API's - Weatherstack, the National Weather Service, and Open-meteo.
## Target Browsers
### Desktop
* Google Chrome
* Microsoft Edge
* Apple Safari
* Firefox
### Mobile 
* iOS Safari
* iOS Chrome
* Android Chrome


## Developer Manual

### Installation
1. Clone the Repository:

    ```
    git clone <Repo Link>

    cd INST377_Final_Project
    ```

2. Install dependencies:

    ```
    npm install
    ```

### Run the App
---
1. Begin by starting the server:
    ```
    npm start
    ```

2. App/Server will be hosted on:
    ```
    http://localhost:3005
    ```

### Testing Functionality
---
1. Test to see if project functionality page is working
    * Click on the table titled "Try the App!" on the Nav Bar
    * Enter a City and a State 
    * See a weather information, clothing recommendations, a map, and 12 hour weather forecast chart for that location

2. Test to see if database is being updated for a new city
    * If a city that hasn't been entered before is entered, see if supabase database table is being updated by entering `http://localhost:3005/locations` into your browser
    * If the city hasn't been entered before, a new row should appear with this format: 
        * `{"id":ID,"created_at":"time_created","place":"new_city_entered","latitude":new_city_latitude,"longitude":new_city_lonngitude}`

### Endpoints for API & Other API's Used
---
1. #### GET /locations
    **Purpose:** Gets the location info such as city name, city latitude, and city longitude stored in supabase database 

    **Test in Insomnia**: `GET http://localhost:3005/locations`

    **Response:** 
    ```json
     [
       {
         "place": "miami",
         "latitude": 25.774,
         "longitude": -80.194
       },
     ]
     ```

---

2. #### POST /locations
    **Purpose:** Enters a new row into the supabase database consisting of the city name, latitude, and longitude if it hasn't been entered before 

    **Test in Insomnia**: `POST http://localhost:3005/location`

    **Response:** 
    ```json
     [
       {
         "place": "<city name>",
         "latitude": <latitude coordinate>,
         "longitude": <longitude coordinate>
       },
     ]
     ```

---

3. #### Other API's

    ##### Weatherstack - https://weatherstack.com/?utm_source=google&utm_medium=cpc&utm_campaign=weatherstack_Search_USCA&gad_source=1&gad_campaignid=21874512450&gbraid=0AAAAAotyZs63gRKaK_s-oIUhofUO-8ryo&gclid=CjwKCAjw56DBBhAkEiwAaFsG-oI9YZCsDWRMMA9IjAdamzvl00jzKPChMQsKrZhYtewHpT48BbTz5xoCK-0QAvD_BwE


    This API is used for collecting real time weather data such as condition, temperature, UV index, humidity, and wind speed to then give the user clothing recommendations.

    An account must be created to receive a personalized API key with a limit of 100 uses under a free subsrciption plan.

    ##### National Weather Service - https://www.weather.gov/documentation/services-web-api

    This API is used for a 12-hour weather forecast for a specific city, displayed using a chart from chart.js library.



    ##### Open-meteo - https://open-meteo.com/en/docs/air-quality-api

    This API is used to get the air quality for a specific city and that is interpreted to give the user a suggestion on whether to go outdoors or stay inside.

--- 

### Bugs and Future Development
---
#### Bugs ###
1. Our app only works if the city is in the U.S. it does not work for international cities
2. The map that plots the location entered on our app is not responsive to screen size
---
#### Future Development
1. Add a recent searches panel so users don't have to reenter the same city
2. Implement ability to search up and get result for international cities
3. Clothing recommendations for different times of the day since temperature is very fluctuant
4. Use AI to generate more specific clothing recommendation images


