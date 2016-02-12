import {Component} from 'angular2/core';
import {NavComponent} from './components/nav/nav.component';

@Component({
    selector: 'my-app',
    directives: [NavComponent],
    templateUrl: 'app/app.html'
})
export class AppComponent { }
