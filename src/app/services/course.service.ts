import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Course } from '../models/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly http = inject(HttpClient);

  getCourses() {
    return this.http.get<Course[]>('/data/miun_courses.json');
  }
}
