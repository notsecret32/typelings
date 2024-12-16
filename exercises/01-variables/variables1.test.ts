import { Equal, Expect } from '../index';

type cases = [
  Expect<Equal<string, typeof variables1>>,
  Expect<Equal<string, typeof variables2>>,
  Expect<Equal<string, typeof variables3>>,
  Expect<Equal<string, typeof variables4>>,
];
