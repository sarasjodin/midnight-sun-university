import { Service, signal } from '@angular/core';
import { Course } from '../models/course';

@Service()
export class ScheduleService {
  private readonly STORAGE_KEY = 'selectedCourses';
  /* selectedCourses = signal<Course[]>([]); */

  /* Initialize selectedCourses with courses loaded from localStorage */
  selectedCourses = signal<Course[]>(this.loadCourses());

  /* Load selected courses from localStorage */
  private loadCourses() {
    const savedCourses = localStorage.getItem(this.STORAGE_KEY);

    if (savedCourses) {
      return JSON.parse(savedCourses) as Course[];
    }

    return [];
  }

  /* Save selected courses to localStorage */
  private saveCourses() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedCourses()));
  }

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

      this.saveCourses();
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
    this.saveCourses();
  }
}
