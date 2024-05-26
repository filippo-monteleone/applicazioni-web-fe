import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedHomeDashboardService {
  private dataSubject: Subject<string> = new Subject();
  placingMarker: boolean = false;

  setData(data: string) {
    this.dataSubject.next(data);
  }

  getData(): Observable<string> {
    return this.dataSubject.asObservable();
  }
  constructor() {}
}
