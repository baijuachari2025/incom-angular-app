import { Routes } from '@angular/router';
import { StudentComponent } from './student/student';
import { CourseComponent } from './course/course';

export const routes: Routes = [
  { path: 'student', component: StudentComponent },
  { path: 'course', component: CourseComponent },
  { path: '**', redirectTo: 'student' },
];
