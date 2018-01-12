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


    app.post('/gotoBar', function(req,res){
        console.log(req.body);
        var businessVisitors = require('./models/businessVisitor');
        var users = require('./models/user');
        return businessVisitors.findOne(
        {
            "$and": [
                {
                   "userId": req.body.id
                }
                ,{
                    "yelpId": req.body.yelpid
                }
            ]
        }
      )
      .exec()
      .then(data => {
       if (!data) {
          console.log("adding "+req.body.yelpid+" with ");
          var localISOTime  = (new Date(Date.now() - tzOffset)).toISOString().slice(0,-1)  
          var newVisitor = new businessVisitors();
          newVisitor.userId             = req.body.id;
          newVisitor.yelpId             = req.body.yelpid;
          newVisitor.isGoingToday       = true;
          newVisitor.lastResponseDate   = localISOTime;
          return newVisitor.save();
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

    //     var auth0 = {  
    // }
        var callback2 = function(err, httpResponse2, body){
            // siteBody = body;
            if (err){throw err;}
            else {            
                // console.log(body)
                userSurveys.find({/*'userId': req.user._id,*/'surveyActive': 1}, function(err, doc){
                    res.render('pages/profile.ejs', {
                        user : req.user,
                        yelpData:JSON.parse(body).businesses,
                        yelpDataString:body,
                        userData: doc,
                        allData: doc /*need this to be EVERYTHING not just this user*/
                    });
                });
                // newFileActions();
            }
        }
        request(options0, /*auth0,*/ callback2);

        var userSurveys  = require('./models/userSurvey');
        

        });
    app.get('/survey/:id' /*, isLoggedIn*/, function(req, res) {
        var userSurveys  = require('./models/userSurvey');
        userSurveys.find({'_id':  req.params.id}, function(err, doc){
            res.render('pages/survey.ejs', {
                    user : req.user,
                    surveyid: req.params.id,
                    thisUrl: "http://"+req.headers.host+req.originalUrl,
                    surveyData: doc,
                    chartNames: doc[0].surveyOptions,
                    chartData: doc[0].surveyResponses.slice(0,doc[0].surveyOptions.length)
            });
        });
    });
    app.post('/survey/:id' , function(req, res) {
        var userSurveys  = require('./models/userSurvey');
        var myupdate = {$inc:{}};
        myupdate.$inc["surveyResponses."+req.body.text] = 1 ;
        myupdate.$inc["responseCount"] = 1 ;
        userSurveys.update({"_id":  req.params.id}, myupdate ,function(err,doc){
            res.redirect('/survey/'+req.params.id);
        });
    });

     app.get('/deletesurvey/:id' , isLoggedIn, function(req, res) {
        var userSurveys  = require('./models/userSurvey');
        userSurveys.update({'_id':  req.params.id, 'userId':req.user._id}, {surveyActive: 0}, function(err, doc){
        });
        res.redirect('/profile');
        
    });

    app.get('/addoptions/:id', isLoggedIn, function(req, res) {
        var userSurveys  = require('./models/userSurvey');
       
        //is this your survey? if not, return to profile
        userSurveys.update({'_id':  req.params.id, 'userId':req.user._id}, {}, function(err, doc){
            if (doc!=undefined){
                    res.render('pages/addoptions.ejs', {
                        user : req.user,
                        surveyid: req.params.id,
                        userData: doc,
                        allData: doc /*need this to be EVERYTHING not just this user*/
                    });       
                // });
            }
            else res.render('pages/profile.ejs', {
                        user : req.user,
                        userData: doc,
                        allData: doc /*need this to be EVERYTHING not just this user*/
                    });       
            });
        });


    app.post('/survey/:id' , function(req, res) {
        var userSurveys  = require('./models/userSurvey');
        var myupdate = {$inc:{}};
        myupdate.$inc["surveyResponses."+req.body.text] = 1 ;
        myupdate.$inc["responseCount"] = 1 ;
        userSurveys.update({"_id":  req.params.id}, myupdate ,function(err,doc){
            res.redirect('/survey/'+req.params.id);
        });
    });

    app.post('/addoptions/:id', function(req,res){
        survey.addoptions(req,res);
        // res.redirect('/survey/'+req.params.id);
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
