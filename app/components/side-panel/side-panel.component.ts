import {Component} from 'angular2/core';
import {Eatery} from '../eatery/eatery.component';


@Component({
    selector: 'side-panel',
    directives: [],
    templateUrl: 'app/components/side-panel/side-panel.component.html',
    styleUrls: ['app/components/side-panel/side-panel.component.css']
})
export class SidePanelComponent {

  eateryList: Array<Eatery> = [];

  constructor(){
    for(var i = 0; i < 10; i++){
      let v = new Eatery('Rest'+i, 'Some description', 40.781349, -73.966614);
      this.eateryList.push(v);
    }
  }

  alert(){
    alert('asf');
  }

}
