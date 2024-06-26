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
  templateUrl: './invoiceView.component.html',
  styleUrl: './invoiceView.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatSelectModule]

})
export class invoiceViewComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  id: number;
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

        this.id = +ParamMap.get('id');
        // load context data
        console.log('id number is ' + this.id)
        this.apiService.getOrder(this.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((order: OrderModel) => {
            // Get the contact
            this.order = order;

          })
      })
  }


  printInvoice() {
    window.print();
  }

  editInvoice(): void {
    this.router.navigate(['/accounting/edit/' + this.id]);
  }

  returnToList(): void {
    this.router.navigate(['/accounting']);
  }
  
  deleteOrder(): void {
    this.apiService.deleteOrder(this.id).subscribe({
      next: (response: any) => {
        this.router.navigate(['/accounting']);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  sendWhatsapp(): void {
  
    this.apiService.sendWhatsapp(this.id).subscribe({
      next: (response: any) => {
        console.log(response)
      },
      error: (err) => {
        console.log(err)
      }
    })
    
  }

  exportToPDF() {
    const content = this.pdfContent.nativeElement;
    this.pdfService.generatePDF(content, 'invoice');
  }
}
