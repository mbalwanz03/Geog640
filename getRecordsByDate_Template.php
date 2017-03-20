<?php
$servername = "test";
$username = "test_user";
$password = "test";
$dbname = "test";

if(isset($_GET['fromDate'])) {
	$fromDate=$_GET['fromDate'];
}
if(isset($_GET['toDate'])) {
	$toDate=$_GET['toDate'];
}

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
// set the PDO error mode to exception
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sth = $conn->prepare("SELECT field1 AS STAFF_NAME, field2 AS VISIT_DATE, field3 AS FIELD_NOTES, field4 AS RECID FROM tablename WHERE fieldname >= :fromDate AND fieldname < :toDate");
$sth->bindParam(':fromDate', $fromDate);
$sth->bindParam(':toDate', $toDate);

$sth->execute();

if ($sth->rowCount() > 0){
    $check = $sth->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($check);
}

$conn = null;

?>

