const express = require('express');
const supabaseClient = require('@supabase/supabase-js')
const bodyParser = require('body-parser')

const app = express()
const port = 3003;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))
const supabaseUrl = 'https://vgbutoouxuevhcwfardz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnV0b291eHVldmhjd2ZhcmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyODYxMjQsImV4cCI6MjA2Mjg2MjEyNH0.hTdVZamtv_fOUmMq1ahWVJyxwxx3CuKFxeX60Ip9BN8';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


app.get('/locations', async (req, res) =>{
    console.log('attempting to get all locations')

    const { data, error } = await supabase.from('locations').select();

    if(error) {
        console.log(`Error: ${error}`);
        res.statusCode = 400
        res.send(error);
    }

    res.send(data)
})

// app.post('/location', async(req, res) => {
//     console.log('Adding Location')

//     console.log(req.body)
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;
//     const state = req.body.state;

//     const { data, error } = await supabase
//     .from('locations')
//     .insert({ firstname: firstName, lastname: lastName, state: state })
//     .select()

//     if(error) {
//     console.log(`Error: ${error}`);
//     res.statusCode = 500
//     res.send(error);
//     }

//     res.send(data);
// })

app.listen(port,() => {
    console.log('app is alive' + port)
    console.log(`Server running on http://localhost:${port}`);
});