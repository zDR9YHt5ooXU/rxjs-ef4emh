import { of, map, Observable, Subject, iif, ReplaySubject } from 'rxjs';
import { shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

const selectedFortigate = new Subject<void>();
const forceUpdate = new Subject<void>();
let value = 0;
let sourceObs;
const factory = () => {
  sourceObs = of(1).pipe(
    map(() => {
      console.log('increment');
      return value++;
    }),
    shareReplay({
      bufferSize: 1,
      refCount: false,
      windowTime: 5000,
    })
  );
};
factory();
const source = forceUpdate.pipe(
  startWith(null),
  switchMap(() => {
    return sourceObs;
  })
);

export const main = () => {
  const final = selectedFortigate.pipe(
    switchMap(() => {
      return source;
    })
  );

  final.subscribe((v) => {
    console.log(`${v}: 1st subscription`);
  });

  final.subscribe((v) => {
    console.log(`${v}: 2nd subscription`);
  });

  selectedFortigate.next();
  selectedFortigate.next();

  setTimeout(() => {
    factory();
    selectedFortigate.next();
  }, 100);

  setTimeout(() => {
    selectedFortigate.next();
  }, 6000);
};
