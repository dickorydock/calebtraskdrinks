// app/models/userSurvey.js
// load the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// define the schema for our user model
var userSurveySchema = mongoose.Schema({
        id             : String,
        userId          : String,
        surveyQuestion : String,
        surveyOptions  : Array,
        surveyResponses: Array,
        surveyActive :Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('userSurvey', userSurveySchema);
