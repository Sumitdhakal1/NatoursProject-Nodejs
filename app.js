const express = require('express');

const app = express();

const fs = require('fs')

app.use(express.json()); //express.json is middelware
// app.get('/', (req, res)=>{

// res.status(200).json({message:'hello from the server', app:'Natours'});

// });

// app.post('/',(req, res)=>{
//     res.send('you can  send post message')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

app.post('/api/v1/tours', (req, res) =>{
//   console.log(req.body);

  const newId = tours[tours.length-1].id+1;
  const newTour = Object.assign({id :newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
    // 201 stands for created
   res.status(201).json({
    status:'success',
    data:{
        tour: newTour
    }
   })
  })
});

const port = 3000
app.listen(port, () => {
    console.log(`App is running on ${port}...`)
})