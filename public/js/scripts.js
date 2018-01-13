        


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
  if (mode=="amgoing")
  { 
    var modereplacementtext= "No, I'm Not Going";
    var modereplacement = "notgoing" ;
    var buttonword = "notgoingButton"; 
  }


  $("#going-"+yelpid).attr('class', buttonword+ " btn") ;
  $("#going-"+yelpid).attr('data-mode',  modereplacement);
  $("#going-"+yelpid).html(modereplacementtext);

console.log("here");
  console.log(yelpid);
  console.log("#going-"+yelpid);
  $.ajax({
    url:'./gotoBar',
    cache: false,
    type: "POST",
    data:{id:id, yelpid:yelpid, mode:mode},
  });       

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
