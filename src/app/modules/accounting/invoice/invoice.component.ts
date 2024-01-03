import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'app/services/api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations     : fuseAnimations,
  imports: [CommonModule, ReactiveFormsModule, MatSortModule, MatFormFieldModule, MatTableModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatSelectModule]

})
export class InvoiceComponent {

  @ViewChild(MatSort) sort: MatSort;

  invoiceForm: FormGroup;
  sourceDocuments: Array<any>;
  isFiltered: boolean = false;
  filteredResults: any[];
  results: any[];
  displayedColumns = ['id', 'customer_name', 'created_at', 'actions']
  dataSource: MatTableDataSource<any>;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.loadTable()

  }

  loadTable(): void {
    this.results = []
    this.filteredResults = [];
    this.apiService.listOrders().subscribe({

      next: (response: any) => {

        this.results = response;
        this.filteredResults = response;
        this.renderTable();
      },

      error: (err) => {
        console.log(err)
      }

    })
  }

  newInvoice(): void {
    this._router.navigate(['edit/new'], {relativeTo: this._activatedRoute});
  }

  renderTable(): void {
    this.dataSource = new MatTableDataSource(this.filteredResults);
    this.dataSource.sort = this.sort;
  }

  openOrder(id): void {
    this._router.navigate(['view/' +id], {relativeTo: this._activatedRoute});
  } 



}