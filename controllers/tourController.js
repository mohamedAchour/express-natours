const { sendSuccess, sendError } = require('../utils/helpers/responses');
const Tour = require('../models/tour');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  next();
};

class APIFeatures {
  constructor(query, queryString, allowedQueryFields) {
    this.query = query;
    this.queryString = queryString;
    this.allowedQueryFields = allowedQueryFields;
  }

  filter() {
    const queryStrKeys = Object.keys(this.queryString);
    const queryObj = {};

    queryStrKeys
      .filter((field) => this.allowedQueryFields.includes(field))
      .forEach((field) => {
        const newObj = JSON.parse(
          JSON.stringify(this.queryString[field]).replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
          )
        );
        queryObj[field] = newObj;
      });

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    //by default : sort by creation date
    let sortBy = '-createdAt';
    if (this.queryString.sort) {
      sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  project() {
    let fields = '-__v';
    if (this.queryString.field) {
      fields = this.queryString.field.split(',').join(' ');
    } else {
      fields = '-__v';
    }

    this.query = this.query.select(fields);

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    if (page > 0) this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getTours = async (req, res) => {
  try {
    //get the query string
    const { query: queryStr } = req;

    //EXECUTE QUERY
    const features = new APIFeatures(
      Tour.find(),
      queryStr,
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
