import { booleanAttributeValue } from 'builder_platform_interaction/screenEditorUtils';

const bar = 'bar';

describe('booleanAttributeValue function', () => {
    it('Returns true if the property value is true', () => {
        const foo = { bar: true };
        expect(booleanAttributeValue(foo, bar)).toBe(true);
    });

    it('Returns true if the property value is the string "true"', () => {
        const foo = { bar: 'true' };
        expect(booleanAttributeValue(foo, 'bar')).toBe(true);
    });

    it('Returns true if the property value is the same as property name', () => {
        const foo = { bar };
        expect(booleanAttributeValue(foo, bar)).toBe(true);
    });

    it('Returns false if the property value is a random string', () => {
        const foo = { bar: 'someString' };
        expect(booleanAttributeValue(foo, 'bar')).toBe(false);
    });

    it('Returns false if the property value is false', () => {
        const foo = { bar: false };
        expect(booleanAttributeValue(foo, 'bar')).toBe(false);
    });

    it('Returns undefined if the property value is undefined', () => {
        const foo = { bar: undefined };
        expect(booleanAttributeValue(foo, 'bar')).toBe(undefined);
    });

    it('Returns undefined if the property does not exist', () => {
        const foo = {};
        expect(booleanAttributeValue(foo, 'bar')).toBe(undefined);
    });
});
