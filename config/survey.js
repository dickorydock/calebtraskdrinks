// config/survey.js

/*anirudh*/
// load up the user model
var userSurvey            = require('../app/models/userSurvey');

// expose this function to our app using module.exports
module.exports =
{
    makesurvey: function(req,res){
        var arrOptions =  [req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.option5];

        //remove blank options
        arrOptions = arrOptions.filter(function(n){ return n != ""}); 

        var newUserSurvey            = new userSurvey();
        
        // set the user's local credentials
        newUserSurvey.surveyQuestion    = req.body.question;
        newUserSurvey.surveyOptions     = arrOptions;
        newUserSurvey.surveyResponses   = [0,0,0,0,0];
        newUserSurvey.surveyActive      = 1 ; 
        newUserSurvey.responseCount     = 0 ; 
        newUserSurvey.surveyCreated     = new Date().toISOString();
        newUserSurvey.userId            = req.user._id;

        // save the userSurvey
        return newUserSurvey.save();
    } ,

    addoptions: function(req,res){
        var arrOptions =  [req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.option5];
        //remove blank options
        arrOptions = arrOptions.filter(function(n){ return n != ""}); 

        var myupdate = {$push:{}};
        var arrZeroes=[];
        for(i=0;i<arrOptions.length;i++){
            arrZeroes.push(0);
        }
        myupdate.$push["surveyOptions"] = arrOptions;
        myupdate.$push["surveyResponses"] = arrZeroes;

        // console.log("PRAY"+arrOptions);
        // console.log("PRAY2"+arrZeroes);
        console.log(myupdate);// arrOptions.forEach(function(arrOption){
            // myupdate.$push["surveyResponses"] = arrOption;
        

        // })
        // myupdate.$push["surveyResponses."+req.body.text] = 1 ;
        // myupdate.$inc["responseCount"] = 1 ;
        // userSurveys.update({"_id":  req.params.id}, myupdate ,function(err,doc){
        //     res.redirect('/survey/'+req.params.id);
        // });

        userSurvey.update({'_id':  req.params.id, 'userId':req.user._id}, {myupdate}, function(err,doc){
              console.log("IN HERE");
              console.log(req.params.id);
              console.log(req.user._id);
              console.log("OUT")
              res.redirect('/survey/'+req.params.id);
        });
    }
    // =========================================================================
    // survey session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // survey.makesurvey(function(user, done) {
        // done(null, user.id);
    // });

    // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
        // User.findById(id, function(err, user) {
            // done(err, user);
        // });
    // });



     // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    // passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        // usernameField : 'email',
        // passwordField : 'password',
        // passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, email, password, done) {
    // survey.makesurvey(req, res, function(req,res){
    //     console.log("this is us");
    //     console.log(req.body);
    //     console.log("this is them");
    //     console.log(res);
    
    // });
        // asynchronous
        // process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        //User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
          //  if (err)
            //    return done(err);

            // check to see if theres already a user with that email
             /* 8-10-2017 NO LONGER ALLOW NEW USERS*/              
             //if ( user) {
            //if (true) {
               // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            //} else {
                // if there is no user with that email



                // create the user
        //         var newUserSurvey            = new userSurvey();

        //         newUser.question.email    = email;
        //         newUser.local.password = newUser.generateHash(password);

        //         newUser.local.genre_broa_cur = 0 ;
        //         newUser.local.genre_caba_cur = 0 ;
        //         newUser.local.genre_chil_cur = 0 ;

        //         newUser.save(function(err) {
        //             if (err)
        //                 throw err;
        //             return done(null, newUser);
        //         });
        //      }});    

        // });

    // }));



};
