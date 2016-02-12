import {Component} from 'angular2/core';

@Component({
    selector: 'map-view',
    templateUrl: 'app/components/map/map.component.html',
    styleUrls: ['app/bootstrap.css', 'app/components/map/map.component.css']
})
export class MapComponent {

  constructor(){
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

}
