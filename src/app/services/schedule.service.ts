import { Service, signal } from '@angular/core';
import { Course } from '../models/course';

@Service()
export class ScheduleService {
  selectedCourses = signal<Course[]>([]);

  /* Add a course to the selected courses */
  addCourse(course: Course) {
    /* Check if the course is already added */
    if (!this.isAdded(course.courseCode)) {
      this.selectedCourses.update((courses) => {
        /* Copy the course list before adding a new course */
        const updatedCourses = courses.slice();
        updatedCourses.push(course);
        return updatedCourses;
      });
    }
  }

  /* Check if a course is already added */
  isAdded(courseCode: string) {
    return this.selectedCourses().some((course) => course.courseCode === courseCode);
  }

  /* Remove a course by course code */
  removeCourse(courseCode: string) {
    this.selectedCourses.update((courses) => {
      return courses.filter((course) => course.courseCode !== courseCode);
    });
  }
}
