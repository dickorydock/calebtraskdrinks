
/*TO DO
fix issue with rows mis-aligning depending on zoom - i have to set the height constant so that messes up some zooms - leaving as an unresolved issue
should buttons be reset every day? - not going to reset these at this point
put bars on a map? - not going to do at this point
sort bars by most popular - not going to do so we can just present the data as Yelp sends it
allow searches for other cities - maybe put a search box on the top of the page? - DONE
change the 'no i'm not going' button to a slider- DONE
only change the button too if if there's an internet connection - DONE 
allow users to login AFTER they do a search-DONE 
*/
function setLocation(el){
  $.ajax({
    url:'./',
    cache: false,
    type: "POST"
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
  // var newColor = "rgb(25, 25, 112,.3)";
  var modereplacementtext = "Yes, I Am Going!" ;
  var buttonword = "amgoingButton"; 
  var addOn = 1; 
  if (mode=="amgoing")
  { 
    var modereplacementtext= "No, I'm Not Going";
    var modereplacement = "notgoing" ;
    var buttonword = "notgoingButton"; 
    // var newColor = "#ffffff";
    var addOn = -1; 
  }
  
  $.ajax({
    url:'./',
    cache: false,
    type: "POST",
    data:{id:id, yelpid:yelpid, mode:mode}
  });

  if (navigator.onLine){
    $("#going-"+yelpid).attr('class', buttonword+ " btn") ;
    $("#going-"+yelpid).attr('data-mode',  modereplacement);
    $("#going-"+yelpid).html(modereplacementtext);
    // $("#going-row-"+yelpid).css('background-color', newColor);
    // $("#going-row-"+yelpid).css('opacity', 0.3);
    var currentSum = $("#"+yelpid+"-sum").html();
    var newSum = parseInt(currentSum)+addOn;
    $("#"+yelpid+"-sum").html(newSum.toString()); 
  }  
}
