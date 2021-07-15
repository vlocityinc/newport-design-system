export const format = jest.fn((formatString, ...args) => formatString + '(' + args.toString() + ')');
