import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
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
import { PaymentTypeModel } from 'app/models/payment_type.model';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoiceDetail.component.html',
  styleUrl: './invoiceDetail.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatSelectModule]

})
export class InvoiceDetailComponent {

  invoiceForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  id: number;
  order: OrderModel;
  concepts: ConceptModel[];
  payment_types: PaymentTypeModel[];
  months: any[] = [
    {id: 1, name: 'Gener'}, 
    {id: 2, name: 'Febrer'},
    {id: 3, name: 'Març'},
    {id: 4, name: 'Abril'},
    {id: 5, name: 'Maig'},
    {id: 6, name: 'Juny'},
    {id: 7, name: 'Juliol'},
    {id: 8, name: 'Agost'},
    {id: 9, name: 'Setembre'},
    {id: 10, name: 'Octubre'},
    {id: 11, name: 'Novembre'},
    {id: 12, name: 'Desembre'}
  ]

  defaultYear: number = new Date().getFullYear();
  
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService

  ) { }

  ngOnInit(): void {
    this.initForm()
    
    this.getData()
    
    this.activatedRoute.paramMap
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((ParamMap) => {
        if (ParamMap.get('id') == 'new') {
          this.addItem();

        } else {
          this.id = +ParamMap.get('id');
          // load context data
          this.apiService.getOrder(this.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((order: OrderModel) => {
              // Get the contact
              this.order = order;
              // Patch values to the form
              this.invoiceForm.patchValue(order);

              // Clear existing order items
              while (this.order_items.length !== 0) {
                this.order_items.removeAt(0);
              }

              // Add order items from the received JSON
              order.order_items.forEach((item) => {
                this.addItem();
                console.log('item', item)
                const itemFormGroup = this.order_items.at(this.order_items.length - 1) as FormGroup;
                itemFormGroup.patchValue({
                  concept: item.concept_id,
                  quantity: item.quantity,
                  price: item.price,
                  total_item: item.quantity * item.price,
                  month: item.month,
                  year: item.year
                });
              })
            })
        }
      })
  }

  get order_items() {
    return this.invoiceForm.get('order_items') as FormArray;
  }

  initForm() {
    this.invoiceForm = this.formBuilder.group({
      id: [''],
      customer_name: ['', Validators.required],
      order_items: this.formBuilder.array([]),
      payment_type_id: ['', Validators.required],
      total_base: ['', Validators.required]
    });
  }



  addItem() {
    const itemGroup = this.formBuilder.group({
      concept: ['', Validators.required],
      month: [null, Validators.required],
      year: [null, Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      total_item: ['']
    });

    this.order_items.push(itemGroup);
  }

  removeItem(index: number) {
    this.order_items.removeAt(index);
  }

  // on concept change,update price
  onConceptChange(event, index: number) {
    const itemFormGroup = this.order_items.at(index) as FormGroup;
    const concept = itemFormGroup.get('concept').value;

    const conceptSelected = this.concepts.find((c) => c.id == concept);
    itemFormGroup.get('price').setValue(conceptSelected.base_price);
    this.calculateTotal(index)
  }


  calculateTotal(index: number) {
    const itemFormGroup = this.order_items.at(index) as FormGroup;
    const quantity = itemFormGroup.get('quantity').value;
    const price = itemFormGroup.get('price').value;

    // Calculate total and update the 'total' form control
    const total_item = quantity && price ? quantity * price : null;
    itemFormGroup.get('total_item').setValue(total_item);

    //calculate total
    const totalFormGroup = this.invoiceForm.get('total_base') as FormControl;
    const items = this.invoiceForm.get('order_items') as FormArray;
    let total = 0;

    for (let i = 0; i < items.length; i++) {
      const itemFormGroup = items.at(i) as FormGroup;
      const totalItem = itemFormGroup.get('total_item').value;
      if (totalItem) {
        total += totalItem;
      }
    }

    totalFormGroup.setValue(total);

  }

  // Function to handle form submission
  onSubmit() {
    console.log(this.invoiceForm.value)

    if (this.invoiceForm.valid) {
      // Process the form data
      this.apiService.createOrder(this.invoiceForm.value).subscribe((res) => {
        console.log(res)
        this.router.navigate(['/accounting'])
      })
    } else {
      // Handle validation errors
      console.log('Form is invalid');
    }
  }

  getData() {
    this.apiService.getConcepts().subscribe((concepts: ConceptModel[]) => {
      this.concepts = concepts
    });  
    
    this.apiService.getPaymentTypes().subscribe((payment_types: PaymentTypeModel[]) => {
      this.payment_types = payment_types
    });
  }


  returnToList(): void {
    this.router.navigate(['/accounting']);
  }

  

}
