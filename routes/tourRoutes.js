const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// //param middleware
// router.param('id');

router.route('/').get(tourController.getTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
