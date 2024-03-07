const Tour = require('../models/tourModel')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));




exports.getAllTours =async (req, res) => {
    try{
        console.log(req.query)
         //build query
        const queryObject = {...req.query}  //destructuring {...}
        const excludeFields =['page', 'sort', 'limit', 'fields']

        excludeFields.forEach(el =>delete queryObject[el])

         //1)advance filtering
         let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`)
         console.log(JSON.parse(queryStr))
         //{difficulty: 'easy', duration:{$gte: 5}}
         //{difficulty: 'easy', duration:{gte: '5'}}
          
         let query= Tour.find(JSON.parse(queryStr))
        // const query= Tour.find(queryObject)
        
        //2) sorting
        if(req.query.sort){
            const sortBy= req.query.sort.split(',').join('')
              query = query.sort(sortBy)
        }else{
            query= query.sort('-createdAt')
        }
          

        //3) field limiting
           if(req.query.fields){
            const fields=req.query.fields.split(',').join(' '); 
            query=query.select(fields)
            console.log(req.query.fields)
           }else{
            query= query.select('-__v')
           }
          

           //4)pagination
           const page = req.query.page * 1 || 1; //default value is 1 of right side
           const limit =req.query.limit * 1 || 100;
           const skip = (page -1) * limit;
           
          query = query.skip(skip).limit(limit);
           

          if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('this page doesnot exists ')
          }
        const tours = await query
         
        //send response
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
                // const tours= await Tour.find(
        //     {
        //         duration:5,
        //         difficulty:'easy'
        //     }
        // )

        // const tours= await Tour.find().where('duration').equals(5).where('difficulty').equals(easy);
         // execute query
    } catch (err){
     res.status(404).json({
        status:'failed',
        message:err
     })
    }

}

exports.getTour =async (req, res) => {
     try{   
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            }
        });
     }catch (err){
        res.status(404).json({
            status:'failed',
            message:err
        })
     }
}

exports.createTour =async (req, res) => {
try{

        // const newTour = new Tour({})
    // newTour.save()
    const newTour = await Tour.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour

        }
    })
} catch(err){
    res.status(400).json({
        status:'fail',
        message: 'err'
    })
}


   
}

exports.updateTour = async (req, res) => {
    try{
       const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        })
        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        })

    }catch(err){
        res.status(404).json({
            status:'fail',
            message:'invalid'
        })
    }
   
}

//not working
exports.deleteTour = async (req, res) => {
    try {
      await Tour.findByIdAndDelete(req.params.id);
  
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };

