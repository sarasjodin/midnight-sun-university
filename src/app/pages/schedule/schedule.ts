import { Component, inject, computed } from '@angular/core';
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

  /* Compute the total credits of selected courses */
  totalCredits = computed(() => {
    return this.selectedCourses().reduce((total, course) => {
      return total + course.points;
    }, 0);
  });

  /* Remove a course from the planner */
  removeCourse(courseCode: string) {
    this.scheduleService.removeCourse(courseCode);
  }
}
