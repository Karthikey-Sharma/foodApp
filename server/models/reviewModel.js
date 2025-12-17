const mongoose = require('mongoose');
const db_link = '';
mongoose.connect(db_link)
  .then(function(db) {
    console.log("DataBase Connected");
  })
  .catch(function(err) {
    console.log(err);
  });

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'review is required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'rating is required']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'userModel',
    required: [true, 'review must belong to a user']
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'planModel',
    required: [true, 'review must belong to a plan']
  }
});

//find findById, findOne
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "name profileImage"
  }).populate("plan");
  next();
});

const reviewModel = mongoose.model('reviewModel', reviewSchema);

// (async function createReview() {
//   let plan = {
//     review: "Bhot Bekar",
//     rating: 4,
//     user: "64d52ab5332fe2e7b9178946",
//     plan: "64da78533180a8351b0c0ea2"
//   };

//   try {
//     let data = await reviewModel.create(plan); // Use the 'plan' object here
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// })();

module.exports = reviewModel;
