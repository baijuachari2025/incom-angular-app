import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_END_POINT } from '../../constants/api.constants';
import { Student } from '../../types/student.model';
import { Course } from '../../types/course.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  constructor(private http: HttpClient) {}

  searchByLastName(lastName: string) {
    return this.http.get<Student[] | any>(`${API_END_POINT}/api/students/searchByLastName`, { params: { lastName } }).pipe(
      map(res => Array.isArray(res) ? res : (res.data ?? res.students ?? []))
    );
  }

  getCoursesByIds(ids: number[]) {
    if (!ids?.length) return forkJoin([]);
    return forkJoin(ids.map(id => this.http.get<Course>(`${API_END_POINT}/api/courses/${id}`)));
  }
}
