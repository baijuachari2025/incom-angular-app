import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './student.html',
  styleUrl: './student.scss',
})
export class StudentComponent {
  lastNameQuery = '';

  onSearch() {
    console.log('Searching for:', this.lastNameQuery);
  }
}
