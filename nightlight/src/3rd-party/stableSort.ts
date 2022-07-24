// https://gist.github.com/fsufitch/18bb4692d5f46b649890f8fd58765fbc with minor style changes

// javascript's Array.prototype.sort is "not necessarily stable"
// https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort

type Comparator<T> = (a: T, b: T) => number;

interface Array<T> {
  stableSort(cmp?: Comparator<T>): T[];
}

const defaultCmp: Comparator<any> = (a, b) => a - b;

Array.prototype.stableSort = function<T>(this: T[], cmp: Comparator<T> = defaultCmp): T[] {
  const stabilized = this.map((el, index) => (([el, index]) as [T, number]));

  const stableCmp: Comparator<[T, number]> = (a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  };

  stabilized.sort(stableCmp);
  for (let i = 0; i < this.length; i++) {
    this[i] = stabilized[i][0];
  }

  return this;
};
