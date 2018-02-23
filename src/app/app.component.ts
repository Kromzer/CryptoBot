import { Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private http: Http) {
    this.http.get('/api/v1/time')
      .map((res: Response) => res.json()).subscribe(result => console.log(result));
  }
}
