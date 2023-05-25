import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject, Subscriber } from 'rxjs';
import { TstI } from './toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  private subject = new Subject<TstI | string >();

  constructor() { }

  async addToast(newToast: TstI){
      this.subject.next(newToast);
      await new Promise(resolve => setTimeout(resolve, 4000));
      this.subject.next('remove');
  }

  clearToast() {
    this.subject.next('');
  }

  getToast(): Observable<any> {
    return this.subject.asObservable();
  }

}


