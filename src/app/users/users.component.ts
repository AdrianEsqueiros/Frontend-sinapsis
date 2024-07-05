import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from './users.service';
import { CustomersService } from '../customers/customers.service';
import { User } from './user.model';
import { Customer } from '../customers/customer.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { MatTableDataSource } from '@angular/material/table';
// import { UsersService } from 'src/app/users.service'; // Adjust the path as necessary
// import { CustomersService } from 'src/app/customers.service'; // Adjust the path as necessary
// import { User } from 'src/app/user.model'; // Adjust the path as necessary
// import { Customer } from 'src/app/customer.model'; // Adjust the path as necessary
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { MatOptionModule } from '@angular/material/core';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule // Import CommonModule for Angular directives
  ]
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  users: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  customers: Customer[] = [];
  displayedColumns: string[] = ['username', 'status', 'customer', 'actions'];
  editing: boolean = false;
  currentUserId?: number;

  constructor(private fb: FormBuilder, private usersService: UsersService, private customersService: CustomersService) {
    this.userForm = this.fb.group({
      username: [''],
      status: [true],
      customerId: [null]
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadCustomers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe((data: User[]) => {
      this.users.data = data;
    });
  }

  loadCustomers() {
    this.customersService.getCustomers().subscribe((data: Customer[]) => {
      this.customers = data;
    });
  }

  onSubmit() {
    const newUser: User = this.userForm.value;
    this.usersService.addUser(newUser).subscribe((user: User) => {
      this.users.data = [...this.users.data, user];
      this.userForm.reset();
    });
  }

  editUser(user: User) {
    this.userForm.patchValue(user);
    this.editing = true;
    this.currentUserId = user.id;
  }

  updateUser() {
    if (this.currentUserId !== undefined) {
      const updatedUser: User = this.userForm.value;
      this.usersService.updateUser(this.currentUserId, updatedUser).subscribe((user: User) => {
        const index = this.users.data.findIndex(u => u.id === this.currentUserId);
        if (index > -1) {
          this.users.data[index] = user;
          this.users.data = [...this.users.data]; // Trigger change detection
        }
        this.userForm.reset();
        this.editing = false;
        this.currentUserId = undefined;
      });
    }
  }

  cancelEdit() {
    this.userForm.reset();
    this.editing = false;
    this.currentUserId = undefined;
  }

  deleteUser(user: User) {
    this.usersService.deleteUser(user.id).subscribe(() => {
      this.users.data = this.users.data.filter(u => u.id !== user.id);
    });
  }
}
