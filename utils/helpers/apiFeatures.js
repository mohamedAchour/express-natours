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

module.exports = APIFeatures;
