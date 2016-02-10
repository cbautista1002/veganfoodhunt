

<?php

  $db_conn = mysqli_connect("localhost", "cbauti01_1", "%4ef-V;.gl^;", "cbauti01_eateries");
  if(mysqli_connect_errno($db_conn)){
    echo "Database Connection Failed: " . mysqli_connect_error();
  }
  else{
    // echo "Database Connection Succeded";
    $query = "INSERT INTO `suggestions`(`name`, `address`, `info`)
             VALUES ('$_POST[r_name]', '$_POST[r_address]', '$_POST[r_info]')";
    // $query = "INSERT INTO `suggestions`(`name`, `address`, `info`)
             // VALUES ('asdfasdf', 'qwerqwer', 'zxcvzxcv')";
    mysqli_query($db_conn, $query);
  }

?>

