import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CourseService } from './course.service';
import { API_END_POINT } from '../../constants/api.constants';
import { Course } from '../../types/course.model';

const mockCourse = (id: number): Course => ({
  courseId: id,
  courseName: `Course ${id}`,
  courseCode: `C${id}`,
  credits: 3,
  department: 'CS',
  startDate: '2024-01-01',
  endDate: '2024-06-01',
});

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array for empty ids', async () => {
    const result = await firstValueFrom(service.getCoursesByIds([]));
    expect(result).toEqual([]);
  });

  it('should return empty array for null ids', async () => {
    const result = await firstValueFrom(service.getCoursesByIds(null as any));
    expect(result).toEqual([]);
  });

  it('should fetch a single course by id', async () => {
    const promise = firstValueFrom(service.getCoursesByIds([1]));
    httpMock.expectOne(`${API_END_POINT}/api/courses/1`).flush(mockCourse(1));
    const courses = await promise;
    expect(courses.length).toBe(1);
    expect(courses[0]).toEqual(mockCourse(1));
  });

  it('should fetch multiple courses by ids using forkJoin', async () => {
    const promise = firstValueFrom(service.getCoursesByIds([1, 2]));
    httpMock.expectOne(`${API_END_POINT}/api/courses/1`).flush(mockCourse(1));
    httpMock.expectOne(`${API_END_POINT}/api/courses/2`).flush(mockCourse(2));
    const courses = await promise;
    expect(courses.length).toBe(2);
    expect(courses[0]).toEqual(mockCourse(1));
    expect(courses[1]).toEqual(mockCourse(2));
  });
});
