import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { API_END_POINT } from '../../constants/api.constants';
import { Course } from '../../types/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpClient) {}

  getCoursesByIds(ids: number[]) {
    if (!ids?.length) return of([]);
    return forkJoin(ids.map(id => this.http.get<Course>(`${API_END_POINT}/api/courses/${id}`)));
  }
}
