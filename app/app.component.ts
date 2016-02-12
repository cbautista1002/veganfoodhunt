import {Component} from 'angular2/core';
import {NavComponent} from './components/nav/nav.component';
import {MapComponent} from './components/map/map.component';

@Component({
    selector: 'my-app',
    directives: [NavComponent, MapComponent],
    templateUrl: 'app/app.html',
    styleUrls: ['app/app.css']
})
export class AppComponent { }
