// @ts-nocheck
import { memoize, escapeForRegExp, isValidNumber, format, sanitizeBoolean } from '../commonUtils';

describe('memoize', () => {
    it('throws an exception if parameter is not a function', () => {
        expect(() => {
            memoize('noafunctionupropablewouldhaveguessed');
        }).toThrow('Not a function');
    });
    describe('memoized selectors and tranforms', () => {
        let counter = 0;

        function testFunction(v) {
            counter++;
            return 'f_' + (typeof v === 'string' ? v : v.f);
        }

        const memoized = memoize(testFunction);

        it('invokes original function if invoked for the first time', () => {
            const result = memoized('0');
            expect(result).toEqual('f_0');
            expect(counter).toEqual(1);
        });

        it('invokes original function if invoked with different arguments', () => {
            const result = memoized('1');
            expect(result).toEqual('f_1');
            expect(counter).toEqual(2);
        });

        it('does not invoke original functions, if the arguments did not change', () => {
            const result = memoized('1');
            expect(result).toEqual('f_1');
            expect(counter).toEqual(2);
        });

        it('invokes original functions if invoked with different arguments after invocation with same arguments', () => {
            const result = memoized('0');
            expect(result).toEqual('f_0');
            expect(counter).toEqual(3);
        });
    });
});

describe('escapeForRegExp', () => {
    it('throws an exception if parameter is not a function', () => {
        expect(() => {
            escapeForRegExp(1);
        }).toThrow('value must be a string');
    });
});

describe('isValidNumber', () => {
    test.each`
        parameterValue | expected
        ${null}        | ${false}
        ${undefined}   | ${false}
        ${''}          | ${false}
        ${'false'}     | ${false}
        ${'true'}      | ${false}
        ${'astring'}   | ${false}
        ${() => {}}    | ${false}
        ${1}           | ${true}
    `('isValidNumber for parameter value: $parameterValue', ({ parameterValue, expected }) => {
        const actual = isValidNumber(parameterValue);
        expect(actual).toBe(expected);
    });
});

describe('format', () => {
    it('returns the string as it is with token (eg: {0}) if no substitution provided', () => {
        const stringWithToken = 'this was about to be done in: {0}';
        const actual = format(stringWithToken);
        expect(actual).toBe(stringWithToken);
    });
});

describe('sanitizeBoolean', () => {
    test.each`
        rawValue     | expected
        ${null}      | ${false}
        ${undefined} | ${false}
        ${''}        | ${false}
        ${false}     | ${false}
        ${true}      | ${true}
        ${'true'}    | ${true}
        ${'false'}   | ${false}
    `('Sanitized boolean for raw value: $rawValue', ({ rawValue, expected }) => {
        const actual = sanitizeBoolean(rawValue);
        expect(actual).toBe(expected);
    });
});
