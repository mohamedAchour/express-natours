const Tour = require('../models/tour');

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find({});

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  const { body } = req;

  try {
    const newTour = await Tour.create(body);
    //201 : for created
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { body: update } = req;
    const options = { new: true, runValidators: true };
    const updatedTour = await Tour.findByIdAndUpdate(id, update, options);

    res.status(200).json({ status: 'success', data: { tour: updatedTour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    await Tour.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};
