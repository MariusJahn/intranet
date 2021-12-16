import { Component, OnInit } from '@angular/core';
import {retry, subscribeOn} from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'intranet-feuerwehr';

  constructor() {

  }

  ngOnInit(): void {

  }


}
