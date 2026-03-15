import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../types/student.model';
import { Course } from '../../types/course.model';
import { StudentService } from '../service/student.service';
import { CourseService } from '../../course/service/course.service';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule, MatExpansionModule, MatButtonModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetailsComponent implements OnInit {
  @Input({ required: true }) student!: Student;
  @Output() studentsUpdated = new EventEmitter<Student[]>();
  courses = signal<Course[]>([]);

  constructor(private studentService: StudentService, private courseService: CourseService, private snackBar: MatSnackBar) {}

  // Fetch course details on component initialization
  ngOnInit() {
    this.courseService.getCoursesByIds(this.student.courseIds).subscribe(courses => this.courses.set(courses));
  }

  onEnrollCourse() {
    const courseId = prompt('Enter Course ID to enroll:');
    if (!courseId) return;
    this.studentService.enrollCourse(this.student.studentId, +courseId).subscribe();
  }

  onUpdateStudent() {
    this.studentService.updateStudent(this.student).subscribe();
  }

  onDeleteStudent() {
    this.studentService.deleteStudent(this.student.studentId).subscribe({
      next: (students) => {
        this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 });
        this.studentsUpdated.emit(students as Student[]);
      }
    });
  }
}
