<!DOCTYPE html>
<html>
<head>
<style>
table {
    width: 100%;
    border-collapse: collapse;
}

table, td, th {
    border: 1px solid black;
    padding: 5px;
}

th {text-align: left;}
</style>
</head>
<body>
<?php
$servername = "test";
$username = "test_user";
$password = "test";
$dbname = "test";
	
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
} else {
	echo "Connected successfully";
}

$sql="SELECT * FROM pz_field_visits";
$result = mysqli_query($conn, $sql);

echo "<table>
<tr>
<th>Name</th>
<th>Date</th>
<th>Notes</th>
<th>UID</th>
</tr>";
while($row = mysqli_fetch_array($result)) {
    echo "<tr>";
    echo "<td>" . $row['pz_name'] . "</td>";
    echo "<td>" . $row['pz_date'] . "</td>";
    echo "<td>" . $row['pz_notes'] . "</td>";
    echo "<td>" . $row['pz_uid'] . "</td>";
    echo "</tr>";
}
echo "</table>";
mysqli_close($conn);
?>
</body>
</html>
