// app/routes.js
module.exports = function(app, passport, survey) {
    var survey   = require('../config/survey.js');
    var request     = require('request');

    // var request   = require('../config/survey.js');

    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', { message: req.flash('loinMessage') }); 
    });

     function saveInstance() {
    
      return businessVisitors.findOne(
        {
            "$and": [
                {
                   "userId": userId
                }
                ,{
                    "yelpId": yelpId
                }
            ]
        }
      )
      .exec()
      .then(data => {
       if (!data) {
          console.log("adding "+yelpId+" with "+userId);
          var localISOTime  = (new Date(Date.now() - tzOffset)).toISOString().slice(0,-1)  
          var newVisitor = new businessVisitors();
          newVisitor.userId             = userId;
          newVisitor.yelpId             = yelpId;
          newVisitor.isGoingToday       = true;
          newVisitor.lastResponseDate   = localISOTime;
          return instancerecord.save();
        }
        return data;
      })
  };

    app.post('/gotoBar', function(req,res){
        var businessVisitors = require('./models/businessVisitor');
        var users = require('./models/user');
        return businessVisitors.findOne(
        {
            "$and": [
                {
                   "userId": userId
                }
                ,{
                    "yelpId": yelpId
                }
            ]
        }
      )
      .exec()
      .then(data => {
       if (!data) {
          console.log("adding "+yelpId+" with "+userId);
          var localISOTime  = (new Date(Date.now() - tzOffset)).toISOString().slice(0,-1)  
          var newVisitor = new businessVisitors();
          newVisitor.userId             = userId;
          newVisitor.yelpId             = yelpId;
          newVisitor.isGoingToday       = true;
          newVisitor.lastResponseDate   = localISOTime;
          return instancerecord.save();
        }
        return data;
      })
    })

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
        // request.
        var options0 = {
            // url: "http://www.talkinbroadway.com/allthatchat_new/index.php"
            url: "https://api.yelp.com/v3/businesses/search?location=Phoenix",
             'auth': {
                'bearer': process.env.YELP_APIKEY
           }

        };

        

        });
      
/*NEXT TO FIX:
--column widths  DONE
--actually link to the survey page DONE
--make a page where you can view the survey and vote! title, options, the number of responses for each.  DONE
--aghhh, make a voting page! DONE
--add graphic display of results to the survey DONE
--ok, so one page for voting, one page for viewing maybe? SAME PAGE
--allow deleting of polls (maybe on the individual poll page?) DONE
--add a sharing option TODO DONE
--add an indicator of DATE when you make a survey, so we can use this to sort

--FIX BUTTONS TO MAKE THEM LOOK NICE
   maybe should allow voting, but maybe not multiple times per...computer? TODO

   LEFT TO DO:
   What if you want more than five options initially? DONE
   only one response per IP?

*/ 


// get the user out of session and pass to template

    app.get('/makesurvey', isLoggedIn, function(req, res) {
        res.render('pages/makesurvey.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });

    app.post('/makesurvey', function(req,res){
        survey.makesurvey(req,res);
       
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
