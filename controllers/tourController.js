const Tour = require('../models/tour');

exports.getTours = async (req, res) => {
  try {
    //BUILD QUERY

    const { query: queryStr } = req;
    const queryStrKeys = Object.keys(queryStr);

    // 1 - Filtering
    const allowedQueryFields = Object.keys(Tour.schema.obj);
    const queryObj = {};

    queryStrKeys
      .filter((field) => allowedQueryFields.includes(field))
      .forEach((field) => {
        const newObj = JSON.parse(
          JSON.stringify(queryStr[field]).replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
          )
        );
        queryObj[field] = newObj;
      });

    // 2 - Sorting
    //by default : sort by creation date
    let sortBy = '-createdAt';
    if (queryStr.sort) {
      sortBy = queryStr.sort.split(',').join(' ');
    }

    // 3 - limit
    let limit = '';
    if (queryStr.limit) {
      ({ limit } = queryStr);
    }

    // 4 - field limiting : projecting
    let fields = '-__v';
    if (queryStr.field) {
      fields = queryStr.field.split(',').join(' ');
    }

    //we have first to define the query and after that wait, this way we can chain other queries, other wise we will
    //the first query will be executed and it will be impossible to chain other queries
    const query = Tour.find(queryObj).sort(sortBy).limit(limit).select(fields);

    //EXECUTE QUERY
    const tours = await query;

    //SEND RESPONSE
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
