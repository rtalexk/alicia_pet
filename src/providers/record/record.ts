import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HOST } from '../config'

@Injectable()
export class RecordProvider {

  ROOT_URL: string = `${HOST}/api`;

  constructor(public http: Http) {
    console.log('Hello RecordProvider Provider');
  }

  getRecord(type: string) {
    let url = `${this.ROOT_URL}/record?type=${type}`;
    return this.http.get(url)
      .do((res: Response) => console.log(res.json()))
      .map((res: Response) => res.json());
  }

  createDevice(id: string) {
    let url = `${this.ROOT_URL}/device/`;
    let device = { registrationId: id };
    return this.http.post(url, device)
      .do((res: Response) => console.log(res.json()))
      .map((res: Response) => res.json());
  }

}
