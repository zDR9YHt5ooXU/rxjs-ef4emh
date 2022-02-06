import './style.css';

import { of, map, Observable, Subject, iif, ReplaySubject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { main } from './manual-cache';
// main();
import { main as play } from './share-replay';
play();
