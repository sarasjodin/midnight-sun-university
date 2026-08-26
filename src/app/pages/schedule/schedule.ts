import { Component, inject, computed, signal } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  imports: [],
  selector: 'app-schedule',
  styleUrl: './schedule.css',
  templateUrl: './schedule.html',
})
export class Schedule {
  /* Inject ScheduleService to manage selected courses */
  private readonly scheduleService = inject(ScheduleService);
  selectedCourses = this.scheduleService.selectedCourses;
  pageIndex = signal(0);
  pageSize = signal(10);
  /* Get the first course number on the current page */
  startCourse = computed(() => {
    return this.pageIndex() * this.pageSize() + 1;
  });
  /* Get the last course number on the current page */
  endCourse = computed(() => {
    const end = (this.pageIndex() + 1) * this.pageSize();
    return Math.min(end, this.selectedCourses().length);
  });

  /* Compute the total credits of selected courses */
  totalCredits = computed(() => {
    return this.selectedCourses().reduce((total, course) => {
      return total + course.points;
    }, 0);
  });

  /* Remove a course from the planner */
  removeCourse(courseCode: string) {
    this.scheduleService.removeCourse(courseCode);

    if (this.pageIndex() >= this.totalPages()) {
      /* Adjust the page index if the current page exceeds the total pages after removal */
      this.pageIndex.set(Math.max(this.totalPages() - 1, 0));
    }
  }

  totalPages = computed(() => {
    return Math.ceil(this.selectedCourses().length / this.pageSize());
  });

  paginatedSelectedCourses = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.selectedCourses().slice(start, end);
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
}
