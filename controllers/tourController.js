const { sendSuccess, sendError } = require('../utils/helpers/responses');
const APIFeatures = require('../utils/helpers/apiFeatures');
const Tour = require('../models/tour');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  next();
};

exports.getTours = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(
      Tour.find(),
      req.query,
      Object.keys(Tour.schema.obj)
    )
      .filter()
      .sort()
      .project()
      .paginate();
    const tours = await features.query;

    if (tours.length <= 0) throw new Error(`Sorry, no results found!`);

    //SEND RESPONSE
    sendSuccess(res, { code: 200, title: 'tours' }, tours, tours.length);
  } catch (err) {
    sendError(res, { code: 404, message: err.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    sendSuccess(res, { code: 200, title: 'tour' }, tour);
  } catch (err) {
    sendError(res, { code: 404, message: err.message });
  }
};

exports.createTour = async (req, res) => {
  const { body } = req;

  try {
    const newTour = await Tour.create(body);
    //201 : for created
    sendSuccess(res, { code: 201, title: 'tour' }, newTour);
  } catch (err) {
    sendError(res, { code: 400, message: err.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { body: update } = req;
    const options = { new: true, runValidators: true };
    const updatedTour = await Tour.findByIdAndUpdate(id, update, options);

    sendSuccess(res, { code: 200, title: 'tour' }, updatedTour);
  } catch (err) {
    sendError(res, { code: 404, message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    await Tour.findByIdAndDelete(id);
    sendSuccess(res, { code: 204, title: 'tour' });
  } catch (err) {
    sendError(res, { code: 404, message: err.message });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { numTours: -1 } },
    ]);

    sendSuccess(res, { code: 200, title: 'stats' }, stats);
  } catch (err) {
    sendError(res, { code: 404, message: err.message });
  }
};
