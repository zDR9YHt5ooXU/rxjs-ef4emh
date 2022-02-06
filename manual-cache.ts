import { of, map, Observable, Subject, iif, ReplaySubject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

// of('World')
//   .pipe(map((name) => `Hello, ${name}!`))
//   .subscribe(console.log);

// Open the console in the bottom right to see results.

const forceupdate = new Subject<void>();

let isCached = false;
let cache = null;
let value = 0;
const source = forceupdate.pipe(
  tap(() => {
    console.log('tap');
    cache = null;
  }),
  startWith(null),
  switchMap(() => {
    return iif(
      () => {
        return !!cache;
      },
      cache,
      of(1).pipe(
        map(() => {
          console.log('incremental');
          return value++;
        }),
        tap((value) => {
          isCached = true;
          if (!cache) {
            cache = new ReplaySubject(1, 5000);
          }
          cache.next(value);
        })
      )
    );
  })
);

export const main = () => {
  const selectFortigate = new Subject<void>();

  selectFortigate
    .pipe(
      switchMap(() => {
        return source;
      })
    )
    .subscribe((value) => {
      console.log(value);
    });

  selectFortigate.next();
  setTimeout(() => {
    selectFortigate.next();
  });
  setTimeout(() => {
    cache = null;
  }, 100);
  setTimeout(() => {
    selectFortigate.next();
    selectFortigate.next();
  }, 200);

  setTimeout(() => {
    selectFortigate.next();
  }, 6000);
  // setTimeout(() => {
  //   forceupdate.next();
  // }, 500);
};
