import {Component} from 'angular2/core';
// Load all directives from angular2-google-maps
import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';


@Component({
    selector: 'map-view',
    directives: [ANGULAR2_GOOGLE_MAPS_DIRECTIVES],
    templateUrl: 'app/components/map/map.component.html',
    styleUrls: ['app/components/map/map.component.css']
})
export class MapComponent {

  lat: number;
  lng: number;
  zoom: number;

  constructor(){
    this.zoom = 12;
    this.getLocation();
  }

  getLocation(){
    let options = {timeout: 10000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
      },
      (error) => {
        console.log(error);
      },
      options
    );
  }
}
