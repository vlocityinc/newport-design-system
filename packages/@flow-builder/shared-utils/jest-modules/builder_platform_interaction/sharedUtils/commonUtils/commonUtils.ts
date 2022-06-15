export const format = jest.fn((formatString, ...args) => formatString + '(' + args.toString() + ')');

export const memoize = jest.fn((func) => func);
