import {Component, Injectable} from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: [
    './main.component.scss'
  ]
})
@Injectable()
export class MainComponent {
  private test: string = '<div>שדגשדגשדגa</div>';

  constructor() {}
}
