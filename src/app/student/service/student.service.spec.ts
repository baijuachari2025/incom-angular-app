import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { API_END_POINT } from '../../constants/api.constants';
import { Student } from '../../types/student.model';

const mockStudent: Student = {
  studentId: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com',
  phone: '123', dateOfBirth: '2000-01-01', gender: 'M',
  enrollmentDate: '2020-01-01', major: 'CS', gpa: 3.5, courseIds: [10]
};

describe('StudentService', () => {
  let service: StudentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(StudentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('searchByLastName', () => {
    it('sets currentLastName and returns array response', () => {
      service.searchByLastName('Doe').subscribe(res => expect(res).toEqual([mockStudent]));
      const req = http.expectOne(r => r.url.includes('searchByLastName'));
      expect(req.request.params.get('lastName')).toBe('Doe');
      expect(service.currentLastName).toBe('Doe');
      req.flush([mockStudent]);
    });

    it('extracts data from { data: [...] } response shape', () => {
      service.searchByLastName('Doe').subscribe(res => expect(res).toEqual([mockStudent]));
      http.expectOne(r => r.url.includes('searchByLastName')).flush({ data: [mockStudent] });
    });

    it('extracts data from { students: [...] } response shape', () => {
      service.searchByLastName('Doe').subscribe(res => expect(res).toEqual([mockStudent]));
      http.expectOne(r => r.url.includes('searchByLastName')).flush({ students: [mockStudent] });
    });

    it('returns empty array for unknown response shape', () => {
      service.searchByLastName('Doe').subscribe(res => expect(res).toEqual([]));
      http.expectOne(r => r.url.includes('searchByLastName')).flush({});
    });
  });

  describe('enrollCourse', () => {
    it('POSTs enroll then re-searches by currentLastName', () => {
      service.currentLastName = 'Doe';
      service.enrollCourse(1, 10).subscribe(res => expect(res).toEqual([mockStudent]));

      http.expectOne(`${API_END_POINT}/api/students/1/enroll/10`).flush({});
      http.expectOne(r => r.url.includes('searchByLastName')).flush([mockStudent]);
    });
  });

  describe('updateStudent', () => {
    it('PUTs student and returns updated student', () => {
      service.updateStudent(mockStudent).subscribe(res => expect(res).toEqual(mockStudent));
      const req = http.expectOne(`${API_END_POINT}/api/students/${mockStudent.studentId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockStudent);
      req.flush(mockStudent);
    });
  });

  describe('deleteStudent', () => {
    it('DELETEs student then re-searches by currentLastName', () => {
      service.currentLastName = 'Doe';
      service.deleteStudent(1).subscribe(res => expect(res).toEqual([]));

      http.expectOne(`${API_END_POINT}/api/students/1`).flush({});
      http.expectOne(r => r.url.includes('searchByLastName')).flush([]);
    });
  });
});
