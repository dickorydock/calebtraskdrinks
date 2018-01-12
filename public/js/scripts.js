        



function gotoBar(el){

  var id = el.getAttribute('data-userid');
  var yelpid = el.getAttribute('data-yelpid');
  var mode = el.getAttribute('data-mode'); 

  // $.ajax({
  //   url:'./gotoBar',
  //   cache: false,
  //   type: "POST",
  //   data:{id:id, yelpid:yelpid, mode:mode},
  // });       

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
