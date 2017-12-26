<!--rendering a list of this user's shows-->

<!--maybe move this to a header file?-->
<ul class="nav">     
<li><a href = "/pbp.php">Play-by-Play</a></li>  
<li>TDF</li>  
</ul>

<!---->

<?php


 /*************************************/
/******* QUICK BUTTONS ***************/
/*************************************/


$classname = 'offxButton';
var user_id  = $_SESSION['id'] ; 


/*we should have been fed a user ID. Were we? if not, set this array*/
$user_id =isset($user_id) ? $user_id : '' ;


$result = query("SELECT username FROM users where id = ? " , $user_id) ; 

/*check if all-future button is checked*/
$allfuturechecked = query(
"SELECT genre_alls_fut FROM users WHERE id = $user_id"
);
   if ($allfuturechecked[0]["genre_alls_fut"] == 1)
    {
        $checkname = 'checked';
		$futurealls = 'onx';
    }
    else if ($allfuturechecked[0]["genre_alls_fut"] != 1)
    {
        $checkname = '';
		$futurealls = 'offx';
    }

?>


<ul class="nav">
	<li> 
		User: <?php echo $result[0]['username'] ?>
	</li>
	<br/> <br/>
	<li> 
		To use this site, we hope you will click on the names of shows you want to see below or use the Quick Select buttons to the right.
	</li>
</ul>

<br/><br/>

<table class="quickwatch" style="float:right;">

<tr>
   <th style='width:40%'>Quickly Select</th>
   <th style='width:30%'>Current</th>
   <th style='width:30%'>Future</th>
</tr>
<?php 
echo "<tr>
   <td><a  class='quickButton'>Watch All</a></td>
   <td><input type='checkbox'  id='all_alls_cur'              data-userid = $user_id data-category = 'All' data-mode = $futurealls data-watchtype = 1 onmousedown=\"watchgenre(this);\" ></input></td>
   <td><input type='checkbox' $checkname  id='all_alls_fut'   data-userid = $user_id data-category = 'All' data-mode = $futurealls data-watchtype = 2 onmousedown=\"watchgenre(this);\" ></input></td>
</tr>";

 $categories = ["Broadway", "Cabaret", "Children/Family", "Concert/Music", "Dance", "Lecture/Discussion", "Live Comedy", "Musical", "Play", "Special Event", "Sporting Event" , "Other"] ; 
foreach ($categories as $category)
{
$shortname = strtolower(substr($category, 0,4)); 
$dummyvarname = "genre_".$shortname."_fut"; 
/*look to see if the category is being watched and check the boxes accordingly*/
$checkboxindicators = query("SELECT  $dummyvarname FROM users where id = $user_id");
foreach ($checkboxindicators as $checkboxindicator)
{ 
   if ($checkboxindicator[$dummyvarname] == 1)
    {
        $checkname = 'checked';
        $onoffname = 'onx';
    }
    else if ($checkboxindicator[$dummyvarname] != 1)
    {
        $checkname = '';
        $onoffname = 'offx';
    }
}

echo "<tr>
       <td><a  class='quickButton'>$category</a></td>
       
       <td><input type='checkbox'  id='all_".$shortname."_cur'           data-userid = $user_id data-category = $category data-mode = 'offx' data-watchtype = 1    onmousedown=\"watchgenre(this);\" ></input></td>
       
       <td><input type='checkbox' $checkname id='all_".$shortname."_fut' data-userid = $user_id data-category = $category data-mode = $onoffname data-watchtype = 2 onmousedown=\"watchgenre(this);\" ></input></td>
       </tr>";
}
?>

</table>

<table class="portfolio sortable" style="display: inline-block" >

	<tr>
		<th style='width: 75%'>Title</th>
		<th style='width: 25%'>Genre</th>
	</tr>
               
<?php

/*****************************************/
/******** PRINTING THE MAIN TABLE ********/
/*****************************************/

$rows = query(
    "SELECT * FROM PBP_offerings
     where user_id = $user_id 
     ORDER BY title  "         
    );


$offered_shows[] = NULL ;     
if ($rows!==false)
{

    foreach ($rows as $row)
    {
         $offered_shows[] = [
         "show_id" => $row["show_id"],
         "title" => $row["title"],
         "watch_this"=>$row["watch_this"],
         "showgenre"=>$row["showgenre"],
         "offer_status"=>$row["offer_status"]
         ] ; 
    }
}

if ($offered_shows != NULL)
{
    foreach ($offered_shows as $offered_show)
        {  
           /*only print currently offered shows*/
           if ($offered_show["offer_status"] == "Current")
           {
               
               echo "<tr>";
                  
               
                   //$currentshow_id =   strval($offered_show["show_id"]) ; 
                   $currentshow_id = strtolower(substr(ltrim($offered_show["showgenre"]), 0, 4)."_".strval($offered_show["show_id"])); 
                   $currentshow_title = $offered_show["title"];
                   $currentshow_genre = $offered_show["showgenre"];
                   $checked = "offx" ; 
                   $classname = "offxButton" ; 
				   
                   $showwatchthis = $offered_show["watch_this"] ; 
                  if ($offered_show["watch_this"] == 1 )
                   {
                        $checked = "onx" ; 
                       $classname = "onxButton";
                   }
                   if (strlen($currentshow_id) > 1 )
                   {
					   echo "<td><a id=$currentshow_id
									class='$classname showButton' 
									data-mode='$checked'
									data-genre='$currentshow_genre'
									onmousedown='watchshow(this)'
									>$currentshow_title</a></td>
							  <td class='genre'>{$offered_show['showgenre']}</td>";
                   }
               echo "</tr>";
               }
        }
}  
         
    ?>
</table> 
 
<ul class="nav">
     <li><a href = "/account.php">Manage My Account</a></li>
</ul>
<br/>

<div>
    <a href="logout.php">Log Out</a>
</div>
