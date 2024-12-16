/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

export type cases = [
  /* Expect */
  Expect<true>,
  // @ts-expect-error
  Expect<false>,

  /* ExpectFalse */
  ExpectFalse<false>,
  // @ts-expect-error
  ExpectFalse<true>,

  /* Equal */
  Expect<Equal<true, true>>,
  ExpectFalse<Equal<false, true>>,
  Expect<Equal<'123', '123'>>,
  ExpectFalse<Equal<'123', string>>,
  Expect<Equal<{ a: number }, { a: number }>>,
  ExpectFalse<Equal<{ a: number }, { b: number }>>,
  ExpectFalse<Equal<any, '123'>>,
  ExpectFalse<Equal<any, unknown>>,

  /* Not Equal */
  Expect<NotEqual<false, true>>,
  ExpectFalse<NotEqual<true, true>>,
];
