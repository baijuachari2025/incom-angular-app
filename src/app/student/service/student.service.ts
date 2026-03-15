import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { API_END_POINT } from '../../constants/api.constants';
import { Student } from '../../types/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  currentLastName = '';

  constructor(private http: HttpClient) {}

  searchByLastName(lastName: string) {
    this.currentLastName = lastName;
    return this.http.get<Student[] | any>(`${API_END_POINT}/api/students/searchByLastName`, { params: { lastName } }).pipe(
      map(res => Array.isArray(res) ? res : (res.data ?? res.students ?? []))
    );
  }

  enrollCourse(studentId: number, courseId: number) {
    return this.http.post(`${API_END_POINT}/api/students/${studentId}/enroll/${courseId}`, {}).pipe(
      switchMap(() => this.searchByLastName(this.currentLastName))
    );
  }

  updateStudent(student: Student) {
    return this.http.put<Student>(`${API_END_POINT}/api/students/${student.studentId}`, student);
  }

  deleteStudent(studentId: number) {
    return this.http.delete(`${API_END_POINT}/api/students/${studentId}`).pipe(
      switchMap(() => this.searchByLastName(this.currentLastName))
    );
  }
}
