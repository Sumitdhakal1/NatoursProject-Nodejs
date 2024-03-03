const express = require('express');

const app = express();

const fs = require('fs')
// app.get('/', (req, res)=>{

// res.status(200).json({message:'hello from the server', app:'Natours'});

// });

// app.post('/',(req, res)=>{
//     res.send('you can  send post message')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

const port = 3000
app.listen(port, () => {
    console.log(`App is running on ${port}...`)
})