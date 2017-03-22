<?php
	$servername = "test";
	$username = "test";
	$password = "test";
	$dbname = "test";

	$conn = mysqli_connect($host,$username,$password,$dbname);
	
	if(isset($_POST['insert_row'])) {
		$uid=$_POST['uid_val'];
		$name=$_POST['name_val'];
		$date=$_POST['date_val'];
		$notes=$_POST['notes_val'];

		$sql = "INSERT INTO table(field1,field2,field3,field4)VALUES('$name',NOW(),'$notes','$uid');";
		$result = mysqli_query($conn, $sql);
		
		if ($result) {
			echo "New record created successfully";
		} else {
			echo "Error: " . $sql . "<br>" . mysqli_error($conn);
		}
	
		mysqli_close($conn);
	} 
?>
