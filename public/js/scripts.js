var $loading = $('#loadingDiv').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });
/*need to figure out how to get this loader showing - don't want to just change the js, because that doesn't go through if there's no internet connection
  and it would be misleading to show otherwise*/

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

function gotoBar(el){
  // console.log(el);

  var id = el.getAttribute('data-userid');
  var yelpid = el.getAttribute('data-yelpid');
  var mode = el.getAttribute('data-mode'); 
  var modereplacement = "amgoing" ;
  var modereplacementtext = "Yes, I Am Going!" ;
  var buttonword = "amgoingButton"; 
  var addon = 1; 
  if (mode=="amgoing")
  { 
    var modereplacementtext= "No, I'm Not Going";
    var modereplacement = "notgoing" ;
    var buttonword = "notgoingButton"; 
    var addOn = -1; 
  }


  $("#going-"+yelpid).attr('class', buttonword+ " btn") ;
  $("#going-"+yelpid).attr('data-mode',  modereplacement);
  $("#going-"+yelpid).html(modereplacementtext);
  // $("#going-"+yelpid+"").html(modereplacementtext);

  $.ajax({
    url:'./profile',
    cache: false,
    type: "POST",
    data:{id:id, yelpid:yelpid, mode:mode},
    success: function() {   
        // console.log("will it be here?");
        //don't reload the page, just change the number
        // location.reload();  

    }
  });

  //maybe besides the ajax request, change something only if the user is connected
  // console.log("Is the browser online? " + navigator.onLine);    

  if (navigator.online){
    //get the current sum value
    console.log("DANG IT");
    var currentSum = $(yelpid+"-sum").val();
    var newSum = currentSum+addOn;
    $(yelpid+"-sum").html(newSum);
 
  }  

  /*POST requests are timing out - fix this 1-13-2018*/

  // var watchword = "Unwatch"; 

  // if (mode=="onx")
  // { 
  //   var watchword = "Watch"; 
  // } 
  // var allgenre = ["othe", "broa", "caba", "chil", "conc", "lect", "live", "musi", "play", "spec", "spor", "danc"] ; 

  
  console.log("callback fired genre!!");
}
     
  /*.fail(function(jqXHR, textStatus, errorThrown) {
  console.log('There has been an error.');
  });*/
