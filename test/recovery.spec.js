// Existing thin coverage: implementation work should add integrated transport and persistence cases.
import { recover } from '../src/recovery-store.js';
test('completed result is replayed', () => expect(recover(new Map([['k',{state:'completed',result:1}]]),'k').action).toBe('replay'));
