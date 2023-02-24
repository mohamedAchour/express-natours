const fs = require('fs');

//read the data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

//custom middlewares
exports.checkBody = (req, res, next) => {
  const { body } = req;

  if (!body.price || !body.name) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });
  }

  next();
};

exports.checkID = (req, res, next, id) => {
  const tour = tours.find((currentTour) => currentTour.id === Number(id));

  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  next();
};

//request handlers
exports.getTours = (req, res) => {
  //Send data in jsend format
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  //Send data in jsend format
  const id = Number(req.params.id);
  const tour = tours.find((currentTour) => currentTour.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id: newId });
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      //201 : for created
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.indexOf(tours.find((tour) => tour.id === id));
  const { body } = req;

  Object.entries(body).forEach(([key, value]) => {
    if (key in tours[index]) {
      tours[index][key] = value;
    }
  });

  res.status(200).json({ status: 'success', data: { tour: tours[index] } });
};

exports.deleteTour = (req, res) => {
  //delete logic
  res.status(204).json({
    status: 'success',
    data: null, // to show that the resources we delete no longer exists
  });
};
