import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';

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
  sortBy = signal<'courseCode' | 'courseName' | 'points' | 'subject'>('courseCode');

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

  /* Sort filtered courses by the selected column */
  sortedCourses = computed(() => {
    /* Copy the filtered list before sorting it */
    const courses = this.filteredCourses().slice();
    const sortBy = this.sortBy();

    if (sortBy === 'courseCode') {
      return courses.sort((a, b) => a.courseCode.localeCompare(b.courseCode, 'sv'));
    }

    if (sortBy === 'courseName') {
      return courses.sort((a, b) => a.courseName.localeCompare(b.courseName, 'sv'));
    }

    if (sortBy === 'points') {
      return courses.sort((a, b) => a.points - b.points);
    }

    if (sortBy === 'subject') {
      return courses.sort((a, b) => a.subject.localeCompare(b.subject, 'sv'));
    }

    return courses;
  });

  /* Update the selected subject from the dropdown */
  setSubject(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSubject.set(select.value);
  }
}
