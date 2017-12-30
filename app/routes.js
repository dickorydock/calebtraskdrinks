// app/routes.js
module.exports = function(app, passport, survey) {
    var survey   = require('../config/survey.js');

    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('pages/index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', { message: req.flash('loginMessage') }); 
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
            var userSurveys  = require('./models/userSurvey');
            userSurveys.find({'userId': req.user._id,'surveyActive': 1}, function(err, doc){
                // console.log("IN HERE");
                // console.log(doc);
                res.render('pages/profile.ejs', {
                    user : req.user,
                    userData: doc,
                    allData: doc /*need this to be EVERYTHING not just this user*/
                });
            });
        });
    app.get('/survey/:id' /*, isLoggedIn*/, function(req, res) {
        // res.redirect('/profile');
        var userSurveys  = require('./models/userSurvey');
        userSurveys.find({'_id':  req.params.id}, function(err, doc){
        res.render('pages/survey.ejs', {
                user : req.user,
                surveyid: req.params.id,
                surveyData: doc
            });
        });
    });
    app.post('/survey/:id' /*, isLoggedIn*/, function(req, res) {
        var userSurveys  = require('./models/userSurvey');
        var incVar = '"surveyResponses.'+req.body.text+'"';

        var vals = {};
        // vals['surveyResponses'.req.body.text] = req.body.hostName;
        userSurveys.update({'_id':  req.params.id}, {"$inc": {'surveyResponses.3' :1}}, { multi: true },function(err,doc){
            console.log("Updated "+req.params.id+" with " + req.body.text);
        });
       
        console.log(req.params.id);
        console.log(incVar);
        // userSurveys.update({'_id':  req.params.id}, {"$inc": {surveyActive: 1}});
        // res.redirect('/profile');
        
        // res.render('pages/survey.ejs', {
        //         user : req.user,
        //         surveyid: req.params.id,
        //         surveyData: doc
        //     });
        // });
    });
           /* userSurveys.find({'userId': req.user._id,'surveyActive': 1}, function(err, doc){
                console.log("IN HERE");
                res.render('pages/profile.ejs', {
                    user : req.user,
                    userData: doc,
                    allData: doc


                });
            });*/
/*NEXT TO FIX:
--column widths 
--actually link to the survey page
--make a page where you can view the survey and vote! title, options, the number of responses for each. 
   maybe should allow voting, but maybe not multiple times per...computer?
--aghhh, make a voting page!
--add graphic display of results to the survey
--ok, so one page for voting, one page for viewing maybe? 
--allow deleting of polls (maybe on the individual poll page?)
*/ // get the user out of session and pass to template

    app.get('/makesurvey', isLoggedIn, function(req, res) {
         // var userSurveys  = require('./models/userSurvey');
        // userSurveys.find({'userId': req.user._id,'surveyActive': 1}, function(err, doc){
        
        res.render('pages/makesurvey.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });
    // });  

    app.post('/makesurvey', function(req,res){
        survey.makesurvey(req,res);
        res.redirect('/profile');
        // , {
            // user : req.user // get the user out of session and pass to template
        // });
        // es, 
            // {successRedirect: '/profile', failureRedirect: '/makeasurvey', failureFlash: true});

        //need to make sure they haven't left some survey options blank - or deal with these if they have!

        //post to the database

        //ok so two tabs on the home page
            //list all your surveys / make a new survey
            //links to most recent surveys made by others
    });

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
