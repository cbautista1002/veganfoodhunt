
<?php

  $mysqli = new mysqli("localhost", "cbauti01_1", "%4ef-V;.gl^;", "cbauti01_eateries");

  /* check connection */
  if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
  }

  $eatery_data = array();
  // If we have to retrieve large amount of data we use MYSQLI_USE_RESULT
  $query = "select d.name, d.food_info, d.website,\n"
         . "l.street, l.street_2, l.city, l.state, l.zipcode, l.lat, l.long from\n"
         . "eatery_details d, eatery_location l where d.id=l.id and d.name=l.name";
  //$query = "SELECT e.name, e.address, e.lat, e.long FROM eatery_location e";
  //$query = "SELECT * FROM eatery_location";
  if ($result = $mysqli->query($query, MYSQLI_USE_RESULT)) {

    while($row = $result->fetch_assoc()){
      $eatery_data[] = array("name"      => $row['name'],
                             "food_info" => $row['food_info'],
                             "website"   => $row['website'],

                             "street"    => $row['street'],
                             "street_2"  => $row['street_2'],
                             "city"      => $row['city'],
                             "state"     => $row['state'],
                             "zipcode"   => $row['zipcode'],

                             "lat"       => $row['lat'],
                             "lng"       => $row['long']);
      //print($row['name']);
    }

    $result->close();
  }
  echo json_encode($eatery_data);

?>
