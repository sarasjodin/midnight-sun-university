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
  sortDirection = signal<'asc' | 'desc'>('asc');

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

  /* Sort filtered courses by the selected column and direction */
  sortedCourses = computed(() => {
    /* Copy the filtered list before sorting it */
    const courses = this.filteredCourses().slice();

    const sortBy = this.sortBy();
    const direction = this.sortDirection();

    if (sortBy === 'courseCode') {
      courses.sort((a, b) => a.courseCode.localeCompare(b.courseCode, 'sv'));
    }

    if (sortBy === 'courseName') {
      courses.sort((a, b) => a.courseName.localeCompare(b.courseName, 'sv'));
    }

    if (sortBy === 'points') {
      courses.sort((a, b) => a.points - b.points);
    }

    if (sortBy === 'subject') {
      courses.sort((a, b) => a.subject.localeCompare(b.subject, 'sv'));
    }

    if (direction === 'desc') {
      courses.reverse();
    }

    return courses;
  });

  /* Change sort column or toggle sort direction */
  setSort(column: 'courseCode' | 'courseName' | 'points' | 'subject') {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }

  /* Update the selected subject from the dropdown */
  setSubject(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSubject.set(select.value);
  }
}
