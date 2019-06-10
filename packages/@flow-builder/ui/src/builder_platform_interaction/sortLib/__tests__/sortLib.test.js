import { multiComparator, stringComparator } from '../sortLib';

describe('stringComparator', () => {
    const input = [
        { name: 'Simon' },
        { name: 'alvin' },
        { name: 'ålvin' },
        { name: 'Éleanor' },
        { name: 'theodore' },
        { name: 'brittany' },
        { name: 'Jeanette' },
        { name: 'Eleanor' }
    ];

    it('throws an error when field is undefined', () => {
        expect(() => stringComparator()).toThrowError(TypeError);
    });

    it('throws an error when field is null', () => {
        expect(() => stringComparator(null)).toThrowError(TypeError);
    });

    it('throws an error when field is not a string', () => {
        expect(() => stringComparator({})).toThrowError(TypeError);
    });

    it('throws an error when field is an empty string', () => {
        expect(() => stringComparator('')).toThrowError(TypeError);
    });

    it('sorts objects alphabetically by name', () => {
        const expected = [
            { name: 'alvin' },
            { name: 'ålvin' },
            { name: 'brittany' },
            { name: 'Éleanor' },
            { name: 'Eleanor' },
            { name: 'Jeanette' },
            { name: 'Simon' },
            { name: 'theodore' }
        ];
        expect(input.sort(stringComparator('name'))).toEqual(expected);
    });

    it('sorts objects alphabetically in reverse by name', () => {
        const expected = [
            { name: 'theodore' },
            { name: 'Simon' },
            { name: 'Jeanette' },
            { name: 'Éleanor' },
            { name: 'Eleanor' },
            { name: 'brittany' },
            { name: 'alvin' },
            { name: 'ålvin' }
        ];
        expect(input.sort(stringComparator('name', true))).toEqual(expected);
    });
});

describe('multiComparator', () => {
    const input = [
        { first: 'Simon', last: 'Seville' },
        { first: 'alvin', last: 'seville' },
        { first: 'theodore', last: 'Seville' },
        { first: 'brittany', last: 'seville' },
        { first: 'Jeanette', last: 'Seville' },
        { first: 'Eleanor', last: 'seville' }
    ];

    it('throws an error when comparators is undefined', () => {
        expect(() => multiComparator()).toThrowError(TypeError);
    });

    it('throws an error when comparators is null', () => {
        expect(() => multiComparator(null)).toThrowError(TypeError);
    });

    it('throws an error when comparators is not an array', () => {
        expect(() => multiComparator({})).toThrowError(TypeError);
    });

    it('throws an error when comparators is empty', () => {
        expect(() => multiComparator([])).toThrowError(TypeError);
    });

    it('sorts objects alphabetically by last then first', () => {
        const expected = [
            { first: 'alvin', last: 'seville' },
            { first: 'brittany', last: 'seville' },
            { first: 'Eleanor', last: 'seville' },
            { first: 'Jeanette', last: 'Seville' },
            { first: 'Simon', last: 'Seville' },
            { first: 'theodore', last: 'Seville' }
        ];
        const comparators = [
            stringComparator('last'),
            stringComparator('first')
        ];
        expect(input.sort(multiComparator(comparators))).toEqual(expected);
    });
});
