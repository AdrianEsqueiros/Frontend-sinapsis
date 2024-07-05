import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CustomersService } from './customers.service';
import { Customer } from './customer.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class CustomersComponent implements OnInit {
  customerForm: FormGroup;
  customers: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = ['name', 'status', 'actions'];
  editing: boolean = false;
  currentCustomerId?: number;

  constructor(private fb: FormBuilder, private customersService: CustomersService) {
    this.customerForm = this.fb.group({
      name: [''],
      status: [true]
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customersService.getCustomers().subscribe((data: Customer[]) => {
      this.customers.data = data;
    });
  }

  onSubmit() {
    const newCustomer: Customer = this.customerForm.value;
    this.customersService.addCustomer(newCustomer).subscribe((customer: Customer) => {
      this.customers.data = [...this.customers.data, customer];
      this.customerForm.reset();
    });
  }

  editCustomer(customer: Customer) {
    this.customerForm.patchValue(customer);
    this.editing = true;
    this.currentCustomerId = customer.id;
  }

  updateCustomer() {
    if (this.currentCustomerId !== undefined) {
      const updatedCustomer: Customer = this.customerForm.value;
      this.customersService.updateCustomer(this.currentCustomerId, updatedCustomer).subscribe((customer: Customer) => {
        const index = this.customers.data.findIndex(c => c.id === this.currentCustomerId);
        if (index > -1) {
          this.customers.data[index] = customer;
          this.customers.data = [...this.customers.data]; // Trigger change detection
        }
        this.customerForm.reset();
        this.editing = false;
        this.currentCustomerId = undefined;
      });
    }
  }

  cancelEdit() {
    this.customerForm.reset();
    this.editing = false;
    this.currentCustomerId = undefined;
  }

  deleteCustomer(customer: Customer) {
    this.customersService.deleteCustomer(customer.id).subscribe(() => {
      this.customers.data = this.customers.data.filter(c => c.id !== customer.id);
    });
  }
}
