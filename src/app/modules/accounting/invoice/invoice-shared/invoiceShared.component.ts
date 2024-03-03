import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'app/services/api.service';
import { OrderModel } from 'app/models/order.model';
import { ConceptModel } from 'app/models/concept.model';
import { OrderItemModel } from 'app/models/orderItem.model';
import { PdfService } from 'app/services/pdf.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoiceShared.component.html',
  styleUrl: './invoiceShared.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatSelectModule]

})
export class invoiceSharedComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  url_id: number;
  order: OrderModel;
  order_items: OrderItemModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private pdfService: PdfService

  ) {
    this.order = new OrderModel()
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((ParamMap) => {

        this.url_id = +ParamMap.get('url_id');
        // load context data
        console.log('id number is ' + this.url_id)
        this.apiService.getOrderByUrl(this.url_id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((order: OrderModel) => {
            // Get the contact
            this.order = order;

          })
      })
  }

  exportToPDF() {
    const content = this.pdfContent.nativeElement;
    console.log(content)
    this.pdfService.generatePDF(content, 'invoice');
  }

  printInvoice() {
    window.print();
    
  }


  

}
