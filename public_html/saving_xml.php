<?php 

if(isset($_POST['xml'])=== true)
{
  $myxml=$_POST['xml'];
}

file_put_contents("xml1.aiml", $myxml);

?>