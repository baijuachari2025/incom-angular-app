import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { StudentService } from './student.service';
import { Student } from '../types/student.model';

@Component({
  selector: 'app-student',
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './student.html',
  styleUrl: './student.scss',
})
export class StudentComponent {
  lastNameQuery = '';
  students = signal<Student[]>([]);
  isLoading = signal(false);

  constructor(private studentService: StudentService) {}

  onSearch() {
    this.isLoading.set(true);
    this.students.set([]);
    this.studentService.searchByLastName(this.lastNameQuery).subscribe({
      next: (data) => { this.students.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
