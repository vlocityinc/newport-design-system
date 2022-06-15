// @ts-nocheck
import { escapeForRegExp, isReference, isValidNumber, removeOrgNamespace, sanitizeBoolean } from '../commonUtils';

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

describe('removeOrgNamespace', () => {
    it('removes the org namespace for value with namespace', () => {
        const valueWithOrgNamespace = 'NS__flowName';
        const expected = 'flowName';
        const actual = removeOrgNamespace(valueWithOrgNamespace);
        expect(actual).toEqual(expected);
    });

    it('returns original value for value without namespace', () => {
        const valueWithNoNamespace = 'flowName';
        const actual = removeOrgNamespace(valueWithNoNamespace);
        expect(actual).toEqual(valueWithNoNamespace);
    });
});
