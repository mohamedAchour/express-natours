const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have  less than 40 chars, got {VALUE}'],
      minlength: [5, 'A tour must have at less 5 chars, got {VALUE}'],
    },
    slug: { type: String },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: '{VALUE} is not supported, must be: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'must be above 1.0, got {VALUE}'],
      max: [5, 'must be below 5.0, got {VALUE}'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //this: only points to current doc on new document creation!!!!
          return value < this.price;
        },
        message: (props) => `must be lower than the price, got ${props.value}`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    //it is a good practice to store images in the fs not in db, here we are just giving a name
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],
    startDates: [Date],
    // slug: { type: String },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.set('toObject', { virtuals: true });
tourSchema.set('toJSON', { virtuals: true });

//DOCUMENT MIDDLEWARE
//PRE: runs before .save() and .create()
// tourSchema.pre('save', function (next) {
//   console.log(
//     '################"Hello From inside the middleware#################'
//   );
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

//POST: runs after all pre middlewares have finished executing
// tourSchema.post('save', (doc, next) => {
//   console.log('Document saved successfuly');
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: this point to the current query
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
