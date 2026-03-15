import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { Student } from '../../types/student.model';
import { Course } from '../../types/course.model';
import { StudentService } from '../service/student.service';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetailsComponent implements OnInit {
  @Input({ required: true }) student!: Student;
  courses = signal<Course[]>([]);

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getCoursesByIds(this.student.courseIds).subscribe(courses => this.courses.set(courses));
  }
}
