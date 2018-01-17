
/*TO DO
fix issue with rows mis-aligning depending on zoom - i have to set the height constant so that messes up some zooms - leaving as an unresolved issue
should buttons be reset every day? - not going to reset these at this point
put bars on a map? - not going to do at this point
sort bars by most popular - not going to do so we can just present the data as Yelp sends it
allow searches for other cities - maybe put a search box on the top of the page? - DONE
change the 'no i'm not going' button to a slider- DONE
only change the button too if if there's an internet connection - DONE 

allow users to login AFTER they do a search-TODO 
*/
function setLocation(el){
	var form = document.createElement('form');
	form.setAttribute('method', 'post');
	form.setAttribute('action', 'http://www.google.com')
  $.ajax({
    url:'./profile',
    cache: false,
    type: "POST",
    data:{id:id, yelpid:yelpid, mode:mode}
  });

  if (navigator.onLine){
    $("#going-"+yelpid).attr('class', buttonword+ " btn") ;
    $("#going-"+yelpid).attr('data-mode',  modereplacement);
    $("#going-"+yelpid).html(modereplacementtext);
    var currentSum = $("#"+yelpid+"-sum").html();
    var newSum = parseInt(currentSum)+addOn;
    $("#"+yelpid+"-sum").html(newSum.toString()); 
  }  
}

function gotoBar(el){
  var id = el.getAttribute('data-userid');
  var yelpid = el.getAttribute('data-yelpid');
  var mode = el.getAttribute('data-mode'); 
  var modereplacement = "amgoing" ;
  var newColor = "yellow";
  var modereplacementtext = "Yes, I Am Going!" ;
  var buttonword = "amgoingButton"; 
  var addOn = 1; 
  if (mode=="amgoing")
  { 
    var modereplacementtext= "No, I'm Not Going";
    var modereplacement = "notgoing" ;
    var buttonword = "notgoingButton"; 
    var newColor = "red";
    var addOn = -1; 
  }
  
  $.ajax({
    url:'./profile',
    cache: false,
    type: "POST",
    data:{id:id, yelpid:yelpid, mode:mode}
  });

  if (navigator.onLine){
    $("#going-"+yelpid).attr('class', buttonword+ " btn") ;
    $("#going-"+yelpid).attr('data-mode',  modereplacement);
    $("#going-"+yelpid).html(modereplacementtext);
    $("#going-row-"+yelpid).attr('background-color', newColor);
    var currentSum = $("#"+yelpid+"-sum").html();
    var newSum = parseInt(currentSum)+addOn;
    $("#"+yelpid+"-sum").html(newSum.toString()); 
  }  
}
     
  /*.fail(function(jqXHR, textStatus, errorThrown) {
  console.log('There has been an error.');
  });*/

//loading class
// var $loading = $('#loadingDiv').hide();
// $(document)
//   .ajaxStart(function () {
//     $loading.show();
//   })
//   .ajaxStop(function () {
//     $loading.hide();
//   });
  
  /*POST requests are timing out - fix this 1-13-2018*/

  // var watchword = "Unwatch"; 

  // if (mode=="onx")
  // { 
  //   var watchword = "Watch"; 
  // } 
  // var allgenre = ["othe", "broa", "caba", "chil", "conc", "lect", "live", "musi", "play", "spec", "spor", "danc"] ; 

  
  // console.log("callback fired genre!!");
//  function saveInstance() {

//   return businessVisitors.findOne(
//     {
//         "$and": [
//             {
//                "userId": userId
//             }
//             ,{
//                 "yelpId": yelpId
//             }
//         ]
//     }
//   )
//   .exec()
//   .then(data => {
//    if (!data) {
//       var localISOTime  = (new Date(Date.now() - tzOffset)).toISOString().slice(0,-1)  
//       var newVisitor = new businessVisitors();
//       newVisitor.userId             = userId;
//       newVisitor.yelpId             = yelpId;
//       //setting clickCount to 1 because if this record is being created, it must have been from a "No, I'm Not Going" state
//       newVisitor.clickCount       = 1;
//       newVisitor.lastResponseDate   = localISOTime;
//       return instancerecord.save();
//     }
//     return data;
//   })
// };
