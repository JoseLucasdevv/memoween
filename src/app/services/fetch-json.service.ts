import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Data } from '../types/img-type';


@Injectable({
  providedIn: 'root'
})
export class FetchJsonService {

  constructor(private readonly http:HttpClient) {

  }

  getJson():Observable<Data>{

    const data = this.http.get<Data>('assets/game.json');

    return data;
  }
}
