// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        genre_alls_fut: Number,
        genre_alls_cur: Number,
        genre_spor_fut: Number,
        genre_spor_cur: Number,
        genre_danc_cur: Number,
        genre_danc_fut: Number,
        genre_alls_fut: Number,
        genre_alls_cur: Number,
        genre_othe_fut: Number,
        genre_othe_cur: Number,
        genre_spec_fut: Number,
        genre_spec_cur: Number,
        genre_play_fut: Number,
        genre_play_cur: Number,
        genre_live_fut: Number,
        genre_live_cur: Number,
        genre_musi_fut: Number,
        genre_musi_cur: Number,
        genre_lect_fut: Number,
        genre_lect_cur: Number,
        genre_conc_fut: Number,
        genre_conc_cur: Number,
        genre_broa_fut: Number,
        genre_broa_cur: Number,
        genre_caba_fut: Number,
        genre_caba_cur: Number,
        genre_chil_fut: Number,
        genre_chil_cur: Number
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
