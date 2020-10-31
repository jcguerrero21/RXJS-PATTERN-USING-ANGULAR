import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
    concat,
    fromEvent,
    interval,
    noop,
    observable,
    Observable,
    of,
    timer,
    merge,
    Subject,
    BehaviorSubject,
    AsyncSubject,
    ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {

        const http$ = createHttpObservable('/api/courses');

        const sub = http$.subscribe(console.log);

        setTimeout(() => sub.unsubscribe(), 0);

    }

    concatAndMergeMethods() {
        const source1$ = of(1, 2, 3);
        const source2$ = of(4, 5, 6);
        const source3$ = of(7, 8, 9);

        const result$ = concat(source1$, source2$, source3$);

        result$.subscribe(
            val => console.log(val)
        );

        const interval1$ = interval(1000);

        const interval2$ = interval1$.pipe(map(val => 10 * val));

        const results = merge(interval1$, interval2$);

        results.subscribe(console.log);
    }

    controlTimesAndClicks() {
        const interval$ = timer(3000, 1000);

        const sub = interval$.subscribe(val => console.log('stream 1 =>'  + val));

        setTimeout(() => sub.unsubscribe(), 5000);

        const click$ = fromEvent(document, 'click');

        click$.subscribe(
            event => console.log(event),
            err => console.log(err),
            () => console.log('completed')
        );
    }

}
