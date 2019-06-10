import {
    booleanMatcher,
    containsMatcher,
    equalsMatcher,
    notEqualsMatcher,
    startsWithMatcher
} from '../matchers';

const verifyValidation = matcher => {
    // throws an error when obj is undefined
    expect(() => matcher()).toThrowError(TypeError);

    // throws an error when obj is null
    expect(() => matcher(null)).toThrowError(TypeError);

    // throws an error when obj is not an object
    expect(() => matcher([])).toThrowError(TypeError);

    // throws an error when key is undefined
    expect(() => matcher({})).toThrowError(TypeError);

    // throws an error when key is null
    expect(() => matcher({}, null)).toThrowError(TypeError);

    // throws an error when key is not a string
    expect(() => matcher({}, {})).toThrowError(TypeError);

    // throws an error when key is an empty string
    expect(() => matcher({}, '')).toThrowError(TypeError);
};

const verifyStringValidation = matcher => {
    verifyValidation(matcher);

    // throws an error when pattern is undefined
    expect(() => matcher({}, 'key')).toThrowError(TypeError);

    // throws an error when pattern is null
    expect(() => matcher({}, 'key', null)).toThrowError(TypeError);

    // throws an error when pattern is not a string
    expect(() => matcher({}, 'key', {})).toThrowError(TypeError);

    // throws an error when pattern is an empty string
    expect(() => matcher({}, 'key', '')).toThrowError(TypeError);
};

describe('containsMatcher', () => {
    it('throws an error for invalid arguments', () => {
        verifyStringValidation(containsMatcher);
    });

    it('finds a match', () => {
        expect(containsMatcher({ name: 'Alvin' }, 'name', 'v')).toEqual(true);
    });

    it('does not find a match', () => {
        expect(containsMatcher({ name: 'Alvin' }, 'name', 'b')).toEqual(false);
    });
});

describe('startsWithMatcher', () => {
    it('throws an error for invalid arguments', () => {
        verifyStringValidation(startsWithMatcher);
    });

    it('finds a match', () => {
        expect(startsWithMatcher({ name: 'Alvin' }, 'name', 'a')).toEqual(true);
    });

    it('does not find a match', () => {
        expect(startsWithMatcher({ name: 'Alvin' }, 'name', 'b')).toEqual(
            false
        );
    });
});

describe('equalsMatcher', () => {
    it('throws an error for invalid arguments', () => {
        verifyValidation(equalsMatcher);
    });

    it('finds a match', () => {
        expect(equalsMatcher({ name: 'Alvin' }, 'name', 'Alvin')).toEqual(true);
    });

    it('does not find a match', () => {
        expect(equalsMatcher({ name: 'Alvin' }, 'name', 'alvin')).toEqual(
            false
        );
    });
});

describe('notEqualsMatcher', () => {
    it('throws an error for invalid arguments', () => {
        verifyValidation(notEqualsMatcher);
    });

    it('finds a match', () => {
        expect(notEqualsMatcher({ name: 'Alvin' }, 'name', 'alvin')).toEqual(
            true
        );
    });

    it('does not find a match', () => {
        expect(notEqualsMatcher({ name: 'Alvin' }, 'name', 'Alvin')).toEqual(
            false
        );
    });
});

describe('booleanMatcher', () => {
    it('throws an error for invalid arguments', () => {
        verifyValidation(booleanMatcher);

        // throws an error when value is not a boolean
        expect(() => booleanMatcher({}, 'key', {})).toThrowError(TypeError);
    });

    it('finds a match', () => {
        expect(
            booleanMatcher({ isChipmunk: true }, 'isChipmunk', true)
        ).toEqual(true);
    });

    it('does not find a match', () => {
        expect(
            booleanMatcher({ isChipmunk: false }, 'isChipmunk', true)
        ).toEqual(false);
    });
});
