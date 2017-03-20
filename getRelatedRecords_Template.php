<?php
$servername = "test";
$username = "test_user";
$password = "test";
$dbname = "test";
	
if(isset($_GET['uid'])) $UID=$_GET['uid'];

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
// set the PDO error mode to exception
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sth = $conn->prepare("SELECT field1 AS STAFF_NAME, field2 AS VISIT_DATE, field3 AS FIELD_NOTES, field4 AS RECID FROM tablename WHERE field = :uid");
$sth->bindParam(':uid', $UID);
$sth->execute();

if ($sth->rowCount() > 0){
    $check = $sth->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($check);
}

$conn = null;

?>

