// @ts-nocheck
import { escapeForRegExp, isReference, isValidNumber, memoize, sanitizeBoolean } from '../commonUtils';

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
        ${'  '}        | ${false}
        ${'false'}     | ${false}
        ${'true'}      | ${false}
        ${'astring'}   | ${false}
        ${new Date()}  | ${false}
        ${() => {}}    | ${false}
        ${NaN}         | ${false}
        ${'11.11.11'}  | ${false}
        ${'11.11'}     | ${true}
        ${1}           | ${true}
        ${0}           | ${true}
        ${0.1234}      | ${true}
    `('isValidNumber for parameter value: $parameterValue', ({ parameterValue, expected }) => {
        const actual = isValidNumber(parameterValue);
        expect(actual).toBe(expected);
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

describe('isReference', () => {
    it('returns true for properly format string ', () => {
        const validString = '{!Flow.CurrentRecord}';
        const actual = isReference(validString);
        expect(actual).toBeTruthy();
    });

    it('returns false for improperly string', () => {
        const invalidString = '{!Flow.CurrentRecord';
        const actual = isReference(invalidString);
        expect(actual).toBeFalsy();
    });

    it('returns false for multiple merge fields', () => {
        const invalidString = '{!Flow.CurrentRecord}{!Flow.CurrentRecord}';
        const actual = isReference(invalidString);
        expect(actual).toBeFalsy();
    });

    it('returns false for non-string', () => {
        const invalidObj = { guid: 1 };
        const actual = isReference(invalidObj);
        expect(actual).toBeFalsy();
    });
});
