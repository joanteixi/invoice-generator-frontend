import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from 'environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { OrderModel } from 'app/models/order.model';
import { ConceptModel } from 'app/models/concept.model';
import { PaymentTypeModel } from 'app/models/payment_type.model';

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

  getOrderByUrl(url_id): Observable<{}> {
    const url = `${this.api}/orders/shared_order/${url_id}`;

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

  getConcepts(): Observable<{}> {
    const url = `${this.api}/concepts`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const concept = ConceptModel.createArray(res, new ConceptModel());
        return concept;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  getPaymentTypes(): Observable<{}> {
    const url = `${this.api}/payment_types`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return PaymentTypeModel.createArray(res, new PaymentTypeModel());
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  sendWhatsapp(id): Observable<{}> {
    const url = `${this.api}/orders/${id}/send_whatsapp`;
    console.log('hola')
    return this.http.post<any>(url, {}).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
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
