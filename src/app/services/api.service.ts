import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from 'environments/environment.development';
import { Observable, catchError, map, throwError } from 'rxjs';
import { OrderModel } from 'app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public api = environment.api;

  constructor(
    public router: Router,
    public http: HttpClient) {
  }

  listOrders():  Observable<{}> {
    const url = `${this.api}/orders`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const order = OrderModel.createArray(res, new OrderModel());
        return order;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  getOrder(id): Observable<{}> {
    const url = `${this.api}/orders/${id}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const order = new OrderModel().newModel(res);
        return order;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  deleteOrder(id): Observable<{}> {
    const url = `${this.api}/orders/${id}`;

    return this.http.delete<any>(url).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }
  
  createOrder(order_data) {
    const url = `${this.api}/orders`;
    return this.http.post<any>(url, order_data).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        console.log('error in service')
        return this.handleError(err);
      })
    );


  }

  handleError(error) {
    console.log('error in service')
    return throwError({'Error': error});
    ;
  }
}
