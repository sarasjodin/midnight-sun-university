import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CourseService } from '../../services/course.service';

@Component({
  imports: [],
  selector: 'app-courses',
  styleUrl: './courses.css',
  templateUrl: './courses.html',
})
export class Courses {
  private readonly courseService = inject(CourseService);

  courses = toSignal(this.courseService.getCourses(), {
    initialValue: [],
  });
}
