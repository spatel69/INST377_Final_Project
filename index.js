const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const port = 3005;

app.use(cors({
  origin: ['http://localhost:5500',     'https://inst-377-final-project-git-main-sahajs-projects-2bdf4a5a.vercel.app',
    'https://inst-377-final-project-ten.vercel.app'],
  methods: ['GET', 'POST'],        
  credentials: true                
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.sendFile('public/main.html', { root: __dirname });
})


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
