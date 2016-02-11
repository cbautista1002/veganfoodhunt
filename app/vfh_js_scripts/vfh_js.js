// ----------------------------------------------------------------------------
// Author: Cbautista
// Description: Various JS functions for site functionality
// ----------------------------------------------------------------------------


var geocoder;
var map;
var user_latlng;
var user_location = {location: null, found: false};
var eatery_marker_list = new Array();
var eatery_markers = new Array();
var business_window_list = new Array();
var xmlhttp;
var search_distance = 100; // Kilometers
var info_window_max_width = 300;

// Enable the visual refresh
google.maps.visualRefresh = true;


// ----------------------------------------------------------------------------
// Function called on load of html page
// ----------------------------------------------------------------------------
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(40.781346, -73.966614);
  var mapOptions = {
    zoom: 12,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}


// ----------------------------------------------------------------------------
// User search address getting functions
// ----------------------------------------------------------------------------

// Functions for finding getting search area using Navigator and user location
function getLocationUsingNav() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setUserLatLongFromNav, showError);
  }
  else{
    document.getElementById('or_statement').innerHTML = "Geolocation is not supported by this browser.";
  }
}
function setUserLatLongFromNav(position_from_nav){
  user_latlng = new google.maps.LatLng(position_from_nav.coords.latitude, position_from_nav.coords.longitude);
  drawUserAndEateryMarkers()
}
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById('print_location').innerHTML="Geolocation Request Denied."
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById('print_location').innerHTML="Location information is unavailable."
      break;
    case error.TIMEOUT:
      document.getElementById('print_location').innerHTML="The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById('print_location').innerHTML="An unknown error occurred."
      break;
  }
}

// Functions for getting search location using address provided by user in text box
// https://developers.google.com/maps/documentation/javascript/geocoding
function codeAddress() {
  var address = document.getElementById("user_location_input").value;
  geocoder.geocode({'address': address}, setUserLatLongFromAddress);
}
function setUserLatLongFromAddress(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    user_latlng = results[0].geometry.location;
    drawUserAndEateryMarkers();
  }
  else {
    alert("Geocode was not successful for the following reason: " + status);
  }
}


// ----------------------------------------------------------------------------
// Functions for getting business locations from database
// ----------------------------------------------------------------------------
function getEateriesFromDB() {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "vfh_js_scripts/get_db_data.php", true);
  xmlhttp.onreadystatechange = processXMLHTTPResponse;
  xmlhttp.send();
}
function processXMLHTTPResponse() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    eatery_marker_list.length = 0;
    var eateries_raw_data_list = JSON.parse(xmlhttp.responseText);
    for(var idx = 0; idx < eateries_raw_data_list.length; idx++){
      var eatery_name      = eateries_raw_data_list[idx].name;
      var eatery_food_info = eateries_raw_data_list[idx].food_info;
      var eatery_website   = eateries_raw_data_list[idx].website;
      var eatery_street    = eateries_raw_data_list[idx].street;
      var eatery_street_2  = eateries_raw_data_list[idx].street_2;
      var eatery_city      = eateries_raw_data_list[idx].city;
      var eatery_state     = eateries_raw_data_list[idx].state;
      var eatery_zipcode   = eateries_raw_data_list[idx].zipcode;
      var eatery_lat       = eateries_raw_data_list[idx].lat;
      var eatery_long      = eateries_raw_data_list[idx].lng;
      var eatery_latlng    = new google.maps.LatLng(eatery_lat, eatery_long);

      var temp = {name      : eatery_name,
                  food_info : eatery_food_info,
                  website   : eatery_website,
                  street    : eatery_street,
                  street_2  : eatery_street_2,
                  city      : eatery_city,
                  state     : eatery_state,
                  zipcode   : eatery_zipcode,
                  latlng    : eatery_latlng
                 };
      // Only store the info for the marker if its within the search_distance radius
      if (calcDistance(temp.latlng, user_latlng) < search_distance) {
        eatery_marker_list.push(temp);
      }
    }
    drawEateryMarkers();
  }
}

// ----------------------------------------------------------------------------
// Functions for drawing things to the map
// ----------------------------------------------------------------------------
// One function to call drawing of user marker and eatery markers
function drawUserAndEateryMarkers(){
  drawUserMarker();
  getEateriesFromDB();
}
// Functions for drawing user search position marker and info window
function drawUserMarker() {
  var user_marker;
  user_marker = new google.maps.Marker({
    map      : map,
    position : user_latlng,
    animation: google.maps.Animation.DROP,
    icon     : 'images/zoom_icon_orange.png',
    draggable: false
  });
  map.setZoom(15);
  map.setCenter(user_latlng);
  if(screen.width > 768){
    map.panBy(-100, 0);
  }
  if (user_location.found == true) {
    user_location.location.setMap(null);
    user_location.found == false;
  }
  user_location.location = user_marker;
  user_location.found = true;
  google.maps.event.addListener(user_location.location, 'click', showSearchInfoWindow);
}
function showSearchInfoWindow(){
  var cur_window = new google.maps.InfoWindow({content:"Searching around this point"});
  cur_window.open(map, user_location.location);
}

// Functions for drawing user search position marker and info window
function drawEateryMarkers() {
  // Clear out existing markers
  for(var idx = 0; idx < eatery_markers.length; idx++){
    eatery_markers[idx].setMap(null);
  }
  // Create the new markers based on the new data from the recent database request
  for(var i = 0; i < eatery_marker_list.length; i++) {
    eatery_marker = new google.maps.Marker({
      map       : map,
      position  : eatery_marker_list[i].latlng,
      animation : google.maps.Animation.DROP,
      icon      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      draggable : false,
      zIndex    : 100
    });
    eatery_markers.push(eatery_marker);
    google.maps.event.addListener(eatery_marker, 'click', activateEateryMarker(eatery_marker, eatery_marker_list[i], i));
  }
  show_carousel();
}
function activateEateryMarker(e, marker, marker_list_position){
  return function(){
    for(var idx = 0; idx < eatery_markers.length; idx++){
      eatery_markers[idx].setZIndex(100);
      eatery_markers[idx].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }
    z = e.setZIndex(1000);
    e.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
    $('.carousel').carousel(marker_list_position);
  }
}

// Functions for showing the carousel
function show_carousel(){

  var carousel_content = "<div id='carousel' class='carousel slide'>";
  carousel_content += "<ol class='carousel-indicators'>";
  for(var i = 0; i < eatery_marker_list.length; i++){
    carousel_content += "<li data-target='#carousel' data-slide-to='" + i + "'" + ((i==0)?" class='active'":"") + "></li>";
  }
  carousel_content += "</ol><div class='carousel-inner'>";
  for(var i = 0; i < eatery_marker_list.length; i++){
    var m = eatery_marker_list[i];
    carousel_content += "<div class='item" + ((i==0)?" active":"")  + "'>";
    carousel_content += "<div class='row'><center><h2>" + m.name + "</h2>";
    carousel_content += m.street + "<br>" + ((m.street_2=="")?"":m.street_2);
    carousel_content += m.city + ", " + m.state + " " + m.zipcode + "<br>";
    carousel_content += "<font size='3'>" + m.food_info + "</font>" + "<br>";
    carousel_content += ((m.website=="")?"":"<a href='" + m.website + "' target='_blank'>" +  m.website  + "</a>")
    carousel_content += "</center></div></div>";
  }
  carousel_content += "</div>";

  carousel_content += "<div id='carousel_arrows' class='row'>" +
                      "<div class='col-md-4'></div><div class='col-md-2'><a class='left' href='#carousel' data-slide='prev'>" +
                      "<span class='glyphicon glyphicon-chevron-left'></span></a></div>";
  carousel_content += "<div class='col-md-2'><a class='right' href='#carousel' data-slide='next'>" + 
                      "<span class='glyphicon glyphicon-chevron-right'></span></a></div><div class='col-md-4'></div>";

  carousel_content += "</div></div><br><div id='carousel_text_link'><a href='javascript:show_list();' class='text-center'>View List</a>";
  document.getElementById("list_overlay").innerHTML     = carousel_content;
  document.getElementById("list_overlay").style.display = "inherit";
  $('.carousel').carousel({
    interval: false
  })
}
function show_list(){
  var list_content = "<div class='list-group'>";
  for(var i = 0; i <  eatery_marker_list.length; i++){
    temp_div_name = "list_item_"+i;
    list_content += "<a href='javascript:show_well(" + temp_div_name + ");' class='list-group-item'>" + eatery_marker_list[i].name;
    list_content += "<div class='well' id=" + temp_div_name + " style='display:none'></div>";
    list_content += "</a>";
  }
  list_content += "</div><a href='javascript:show_carousel();' class='text-center'>Back to Slides</a>";
  document.getElementById("list_overlay").innerHTML     = list_content;
  document.getElementById("list_overlay").style.display = "inherit";
}
function show_well(div_well){
  if (document.getElementById(div_well.id).style.display == "none"){
    document.getElementById(div_well.id).innerHTML     = "test display";
    document.getElementById(div_well.id).style.display = "inherit";
  }
  else{
    document.getElementById(div_well.id).style.display = "none";
  }
}

// http://stackoverflow.com/questions/506747/working-out-distances-between-two-points-using-google-maps-api
// calculates distance between two points in km's
function calcDistance(p1, p2) {
  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}


function storeSuggestion() {
  var r_name = document.getElementById("inputRestaurant").value;
  var r_address = document.getElementById("inputAddress").value;
  var r_info = document.getElementById("inputInfo").value;
  var statement = "Thanks for your submission!\n\n  Restaurant:    " + r_name +
                  "\n  Address:    " + r_address + "\n  Info:    " + r_info + "\n";

  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "vfh_js_scripts/suggestions_storage.php", true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("r_name=" + r_name + "&r_address=" + r_address + "&r_info=" + r_info);

  var modal_table = "<table border=0><tr><td><h4>Name:</h4></td><td><p>" + r_name + "</p></td></tr>" +
                                    "<tr><td><h4>Address:</h4></td><td><p>" + r_address + "</p></td></tr>" +
                                    "<tr><td><h4>Info:</h4></td><td><p>" + r_info + "</p></td></tr></table>";
  document.getElementById("modal_body_contents").innerHTML = modal_table;

  document.getElementById("inputRestaurant").value  = "";
  document.getElementById("inputAddress").value     = "";
  document.getElementById("inputInfo").value        = "";

  $('#myModal').modal()

  return false;
}
