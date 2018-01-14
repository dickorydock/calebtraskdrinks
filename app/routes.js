// app/routes.js
module.exports = function(app, passport, survey) {
    var survey   = require('../config/survey.js');
    var request     = require('request');

    // var request   = require('../config/survey.js');

    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        var userSurveys  = require('./models/userSurvey');
        userSurveys.find({'surveyActive': 1}, function(err, doc){
            res.render('pages/index.ejs', {
               allData: doc /*need this to be EVERYTHING not just this user*/
            });
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {


        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', { message: req.flash('loinMessage') }); 
    });

   // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
    });

      // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        var businessVisitors = require('./models/businessVisitor');
        
        var options0 = {
            url: "https://api.yelp.com/v3/businesses/search?location=Phoenix",
             'auth': {'bearer': process.env.YELP_APIKEY}
        };

        var callback2 = function(err, httpResponse2, body){
            // siteBody = body;

            //make an array of all of the yelpids from the request
            var bodyJSON = JSON.parse(body);

            var alltheseids = [];
            for(var i in bodyJSON.businesses)
            {
             alltheseids.push(bodyJSON.businesses[i].id);
            }
            // var allIds = bodyJSON.businesses.map(function(item) {
            // return item.id;
            // });
            console.log("oooof");
            console.log(alltheseids);

            var profileCallback = function(err, data){
                userSurveys.find({/*'userId': req.user._id,*/'surveyActive': 1}, function(err, doc){

                    /*also need to pass the data on from here about numbers*/
                    res.render('pages/profile.ejs', {
                        user : req.user,
                        yelpData:JSON.parse(body).businesses,
                        yelpDataString:body,
                        userData: doc
                    });
                });
            }

            businessVisitors.
            where('id').in(alltheseids).
            exec(profileCallback);
            // var yelpIdList = bodyJSON.businesses.id;
            // continue from here
            //basically need to search our database for any of these yelpids, then if they're in there make an array that contains:
            //     [[yelpid1, sumcount1], [yelpid2, sumcount2], ...]
            //...and then pass that array on to the res.render below
            
            // if (err){throw err;}
            // else {            
              
                // newFileActions();
            // }


        }
        request(options0, callback2);
        var userSurveys  = require('./models/userSurvey');
        });

    app.post('/profile', function(req,res){
        console.log(req.body);
        var businessVisitors = require('./models/businessVisitor');
        var updateCount = 1 ; 
        if ( req.body.mode == "amgoing"){
            updateCount = 0 ;
        }
        console.log("updateCount is "+updateCount);
       var myupdate = {$set: {clickCount:updateCount}};
       var users = require('./models/user');     
            return businessVisitors.update(
            {"$and": [{"userId": req.body.id},{"yelpId": req.body.yelpid}]}, myupdate, {multi: true}, function(err,data){

            //if there wasn't a record before, make one
             if (data.n==0) {
                console.log(data);
                console.log("yeah in here");
                var tzOffset       = (new Date()).getTimezoneOffset() * 60000 ;
                var localISOTime  = (new Date(Date.now() - tzOffset)).toISOString().slice(0,-1)  
                var newVisitor = new businessVisitors();
                newVisitor.userId             = req.body.id;
                newVisitor.yelpId             = req.body.yelpid;
                newVisitor.isGoingToday       = true;
                newVisitor.clickCount         = 1;
                newVisitor.lastResponseDate   = localISOTime;
                return newVisitor.save();

                /*allow people to GO
                create count of how many are going
                can i say i'm going tomorrow instead of today?
                can i see these on a map?
                */
            }
            // return data;
            res.redirect('/profile');
         })     
    })


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
