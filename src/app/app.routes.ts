import { Routes } from '@angular/router';
import { Courses } from './pages/courses/courses';
import { Schedule } from './pages/schedule/schedule';

export const routes: Routes = [
  {
    path: '',
    component: Courses,
  },
  {
    path: 'courses',
    component: Courses,
  },
  {
    path: 'schedule',
    component: Schedule,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
