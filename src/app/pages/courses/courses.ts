import { Component, computed, inject, signal } from '@angular/core';
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

  searchTerm = signal('');

  filteredCourses = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    return this.courses().filter((course) => {
      return (
        course.courseCode.toLowerCase().includes(search) ||
        course.courseName.toLowerCase().includes(search)
      );
    });
  });
}
