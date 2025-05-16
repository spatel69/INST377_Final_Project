
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3005;

app.use(cors({
  origin: 'http://localhost:5500', 
  methods: ['GET', 'POST'],        
  credentials: true                
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


const supabaseUrl = 'https://vgbutoouxuevhcwfardz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnV0b291eHVldmhjd2ZhcmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyODYxMjQsImV4cCI6MjA2Mjg2MjEyNH0.hTdVZamtv_fOUmMq1ahWVJyxwxx3CuKFxeX60Ip9BN8';
const supabase = createClient(supabaseUrl, supabaseKey);


app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


app.get('/locations', async (req, res) => {
  console.log('Attempting to get locations');

  const { data, error } = await supabase.from('location').select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 400;
    // return res.status(400).send(error);
    res.send(error);
  }

  res.send(data)
});

app.post('/location', async (req, res) => {
  console.log('Adding a location');

  console.log(req.body);

  const place = req.body.place;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const { data, error } = await supabase
    .from('location')
    .insert([{ 
        place: place,
        latitude: latitude,
        longitude: longitude,
     }]);

//   const { data, error } = await supabase
//     .from('location')
//     .upsert({ 
//         place: place,
//         latitude: latitude,
//         longitude: longitude,
//      },
//      {
//         onConflict: 'place,latitude,longitude',
//         ignoreDuplicates: true
//      }
//     );    
    
//   const { data, error } = await supabase
//     .from('location')
//     .upsert({ 
//         place: place,
//         latitude: latitude,
//         longitude: longitude,
//      })  

//      .select();
     


  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  }
  
  res.send(data);
  
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

