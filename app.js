const fs = require('fs');

const express = require('express');
const morgan = require('morgan');

const app = express();

//###########MIDDLEWARES###########

//json middleware
//this will add data to the body of request object
app.use(express.json());

//morgan
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//###########CONSTS###########

const API_PATH = '/api/v1';
//read the data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

//#########ROUTES HNADLERS : CONTROLLERS###########

//Tours
const getTours = (req, res) => {
  //Send data in jsend format
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  //Send data in jsend format
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //201 : for created
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.indexOf(tours.find((tour) => tour.id === id));
  if (index < 0)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  const data = req.body;

  for (const key in data) {
    if (key in tours[index]) {
      tours[index][key] = data[key];
    }
  }
  res.status(200).json({ status: 'success', data: { tour: tours[index] } });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.indexOf(tours.find((tour) => tour.id === id));
  if (index < 0)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  //delete logic
  res.status(204).json({
    status: 'success',
    data: null, // to show that the resources we delete no longer exists
  });
};

//Users

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet implemented',
  });
};

//#########ROUTES###########

const tourRouter = express.Router();
const userRouter = express.Router();

//mounting routers on the application
app.use(`${API_PATH}/tours`, tourRouter);
app.use(`${API_PATH}/users`, userRouter);

tourRouter.route('/').get(getTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route(`/`).get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//###########START THE SERVER###########
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
