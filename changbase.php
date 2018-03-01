<?php
  
$data = array(
 'tid' => 100, 
 'name' => 'aa',
 'site' => 'aa');
  
$response = array(
 'code' => 200, 
 'message' => 'success for request',
 'data' => $data,
 );
  
echojson_encode($response);
