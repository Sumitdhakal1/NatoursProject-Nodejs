const express = require('express');

const app = express();

const fs = require('fs');

const morgan = require('morgan')

app.use(express.json()); //express.json is middelware

// first middelware
app.use((req, res, next)=>{
    console.log('hello from the middelware😤');
    next();
});

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
}); 

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// routes
const getAllTours = (req, res) => {
     console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requestDate:req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
}

const getTour = (req, res) => {
    console.log(req.params)
    //converts string to number its trick *1
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)
    //  if(id> tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
            requestDate:req.requestDate,
        }
    });
}

const createTour = (req, res) => {
    //   console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // 201 stands for created
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req, res) => {

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour...>'
        }
    })
}

const deleteTour = (req, res) => {

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
}
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)


app.route('/api/v1/tours').get(getAllTours).post(createTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)



//start server
const port = 3000
app.listen(port, () => {
    console.log(`App is running on ${port}...`)
})