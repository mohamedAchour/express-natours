const fs = require('fs');
const express = require('express');

const app = express();

//use a middleware
//this will add data to tye body of request object
app.use(express.json());

const API_PATH = '/api/v1';
//read the data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

//GET
app.get(`${API_PATH}/tours`, (req, res) => {
  //Send data in jsend format
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

app.get(`${API_PATH}/tours/:id`, (req, res) => {
  //Send data in jsend format
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

//POST
//Note that express doesn't put request body data in the request,so to have access to that data, we have to use a middleware
app.post(`${API_PATH}/tours`, (req, res) => {
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
});

//PATCH
app.patch(`${API_PATH}/tours/:id`, (req, res) => {
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
});

//DELETE
app.delete(`${API_PATH}/tours/:id`, (req, res) => {
  const id = Number(req.params.id);
  const index = tours.indexOf(tours.find((tour) => tour.id === id));
  if (index < 0)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  //delete logic
  res.status(204).json({
    status: 'success',
    data: null, // to show that the resources we delete no longer exists
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
