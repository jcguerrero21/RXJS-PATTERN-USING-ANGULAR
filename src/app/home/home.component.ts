import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, timer, throwError } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter, finalize } from 'rxjs/operators';
import { createHttpObservable } from 'app/common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    ngOnInit() {

        const http$ = createHttpObservable('/api/courses');

        // const courses$: Observable<Course[]> = http$
        //     .pipe(
        //         catchError(err => {
        //             console.log('Errror ocurred', err);
        //             return throwError(err);
        //         }),
        //         finalize(() => {
        //             console.log('Finalize executed...');
        //         }),
        //         tap(() => console.log('HTTP Request executed')),
        //         map(res => Object.values(res['payload'])),
        //         shareReplay()
        //     );

         const courses$: Observable<Course[]> = http$
            .pipe(
                tap(() => console.log('HTTP Request executed')),
                map(res => Object.values(res['payload'])),
                shareReplay(),
                retryWhen(errors => errors.pipe(
                    delayWhen(() => timer(2000))
                ))
            );

        this.beginnerCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === 'BEGINNER'))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === 'ADVANCED'))
            );

    }

}
