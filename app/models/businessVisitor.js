// app/models/userSurvey.js
// load the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// define the schema for our user model
var businessVisitorSchema = mongoose.Schema({
        userId          : String,
        yelpId			: String,
        isGoingToday    : Boolean,
        clickCount      : Number,
        lastResponseDate:Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('businessVisitor', businessVisitorSchema);
