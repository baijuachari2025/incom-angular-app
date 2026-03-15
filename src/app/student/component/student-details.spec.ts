import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StudentDetailsComponent } from './student-details';
import { StudentService } from '../service/student.service';
import { CourseService } from '../../course/service/course.service';
import { Student } from '../../types/student.model';
import { Course } from '../../types/course.model';

const mockStudent: Student = {
  studentId: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com',
  phone: '555-1234', dateOfBirth: '2000-01-01', gender: 'Male',
  enrollmentDate: '2023-01-01', major: 'CS', gpa: 3.5, courseIds: [10, 20]
};

const mockCourses: Course[] = [
  { courseId: 10, courseName: 'Math', courseCode: 'MTH101', credits: 3, department: 'Science', startDate: '2023-01-01', endDate: '2023-05-01' },
  { courseId: 20, courseName: 'English', courseCode: 'ENG101', credits: 3, department: 'Arts', startDate: '2023-01-01', endDate: '2023-05-01' }
];

describe('StudentDetailsComponent', () => {
  let fixture: ComponentFixture<StudentDetailsComponent>;
  let component: StudentDetailsComponent;

  const studentService = {
    enrollCourse: vi.fn(),
    updateStudent: vi.fn(),
    deleteStudent: vi.fn()
  };
  const courseService = { getCoursesByIds: vi.fn() };
  const snackBar = { open: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    courseService.getCoursesByIds.mockReturnValue(of(mockCourses));

    await TestBed.configureTestingModule({
      imports: [StudentDetailsComponent],
      providers: [
        provideAnimations(),
        { provide: StudentService, useValue: studentService },
        { provide: CourseService, useValue: courseService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;
    component.student = mockStudent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    expect(courseService.getCoursesByIds).toHaveBeenCalledWith(mockStudent.courseIds);
    expect(component.courses()).toEqual(mockCourses);
  });

  it('should reload courses on ngOnChanges', () => {
    courseService.getCoursesByIds.mockClear();
    component.ngOnChanges();
    expect(courseService.getCoursesByIds).toHaveBeenCalledWith(mockStudent.courseIds);
  });

  it('should enroll course and emit studentsUpdated', () => {
    const updatedStudents = [mockStudent];
    studentService.enrollCourse.mockReturnValue(of(updatedStudents));
    vi.spyOn(window, 'prompt').mockReturnValue('10');
    const emitSpy = vi.spyOn(component.studentsUpdated, 'emit');

    component.onEnrollCourse();

    expect(studentService.enrollCourse).toHaveBeenCalledWith(1, 10);
    expect(snackBar.open).toHaveBeenCalledWith('Student enrolled in course successfully', 'Close', { duration: 3000 });
    expect(emitSpy).toHaveBeenCalledWith(updatedStudents);
  });

  it('should not enroll if prompt is cancelled', () => {
    vi.spyOn(window, 'prompt').mockReturnValue(null);
    component.onEnrollCourse();
    expect(studentService.enrollCourse).not.toHaveBeenCalled();
  });

  it('should call updateStudent', () => {
    studentService.updateStudent.mockReturnValue(of(mockStudent));
    component.onUpdateStudent();
    expect(studentService.updateStudent).toHaveBeenCalledWith(mockStudent);
  });

  it('should delete student and emit studentsUpdated', () => {
    const updatedStudents = [mockStudent];
    studentService.deleteStudent.mockReturnValue(of(updatedStudents));
    const emitSpy = vi.spyOn(component.studentsUpdated, 'emit');

    component.onDeleteStudent();

    expect(studentService.deleteStudent).toHaveBeenCalledWith(1);
    expect(snackBar.open).toHaveBeenCalledWith('Student deleted successfully', 'Close', { duration: 3000 });
    expect(emitSpy).toHaveBeenCalledWith(updatedStudents);
  });
});
