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
  selectedSubject = signal('');

  /* Create a list of unique subjects from all courses */
  subjects = computed(() => {
    const subjects = this.courses().map((course) => course.subject);
    const uniqueSubjects = new Set(subjects);

    return Array.from(uniqueSubjects);
  });

  /* Filter courses by search term and selected subject */
  filteredCourses = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const subject = this.selectedSubject();

    return this.courses().filter((course) => {
      const matchesSearch =
        course.courseCode.toLowerCase().includes(search) ||
        course.courseName.toLowerCase().includes(search);

      const matchesSubject = subject === '' || course.subject === subject;

      return matchesSearch && matchesSubject;
    });
  });

  /* Update the selected subject from the dropdown */
  setSubject(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSubject.set(select.value);
  }
}
