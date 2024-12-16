type cases = [
  Expect<Equal<string, typeof variable1>>,
  Expect<Equal<number, typeof variable2>>,
  ExpectFalse<Equal<boolean, typeof variable3>>,
  Expect<Equal<Array<number>, typeof variable4>>,
];
