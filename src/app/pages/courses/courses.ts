import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CourseService } from '../../services/course.service';
import { ScheduleService } from '../../services/schedule.service';
import { Course } from '../../models/course';

@Component({
  imports: [],
  selector: 'app-courses',
  styleUrl: './courses.css',
  templateUrl: './courses.html',
})
export class Courses {
  /* Fetch courses from JSON */
  private readonly courseService = inject(CourseService);

  /* Inject ScheduleService to manage selected courses */
  private readonly scheduleService = inject(ScheduleService);

  courses = toSignal(this.courseService.getCourses(), {
    initialValue: [],
  });
  searchTerm = signal('');
  selectedSubject = signal('');
  sortBy = signal<'courseCode' | 'courseName' | 'points' | 'subject'>('courseCode');
  sortDirection = signal<'asc' | 'desc'>('asc');
  pageIndex = signal(0);
  pageSize = signal(10);

  sortLabel() {
    const sortBy = this.sortBy();

    if (sortBy === 'courseCode') {
      return 'Code';
    }

    if (sortBy === 'courseName') {
      return 'Course';
    }

    if (sortBy === 'points') {
      return 'Credits';
    }

    return 'Subject';
  }

  /* Get the first course number on the current page */
  startCourse = computed(() => {
    return this.pageIndex() * this.pageSize() + 1;
  });
  /* Get the last course number on the current page */
  endCourse = computed(() => {
    const end = (this.pageIndex() + 1) * this.pageSize();
    return Math.min(end, this.filteredCourses().length);
  });

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
    this.pageIndex.set(0);
  }

  /* Check if a course is already added */
  isAdded(courseCode: string) {
    return this.scheduleService.isAdded(courseCode);
  }

  /* Add or remove a course */
  toggleCourse(course: Course) {
    if (this.isAdded(course.courseCode)) {
      this.scheduleService.removeCourse(course.courseCode);
    } else {
      this.scheduleService.addCourse(course);
    }
    // TODO: Remove when Planner page is implemented
    console.log(this.scheduleService.selectedCourses());
  }

  /* Update the selected subject from the dropdown */
  setSubject(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSubject.set(select.value);
    this.pageIndex.set(0);
  }

  totalPages = computed(() => {
    return Math.ceil(this.sortedCourses().length / this.pageSize());
  });

  paginatedCourses = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.sortedCourses().slice(start, end);
  });

  /* Go to the previous page */
  prev() {
    if (this.pageIndex() > 0) {
      this.pageIndex.update((page) => page - 1);
    }
  }

  /* Go to the next page */
  next() {
    if (this.pageIndex() < this.totalPages() - 1) {
      this.pageIndex.update((page) => page + 1);
    }
  }

  /* Change number of courses per page */
  setPageSize(event: Event) {
    const select = event.target as HTMLSelectElement;

    this.pageSize.set(Number(select.value));
    this.pageIndex.set(0);
  }

  /* Update the search term */
  setSearchTerm(event: Event) {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
    this.pageIndex.set(0);
  }
}
