import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Course } from '../models/course';

@Service()
export class CourseService {
  private readonly http = inject(HttpClient);

  getCourses() {
    return this.http.get<Course[]>('/data/miun_courses.json');
  }
}
