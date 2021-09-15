import {
    booleanAttributeValue,
    attributesHaveChanged,
    getAllScreenFields
} from 'builder_platform_interaction/screenEditorUtils';
import { elementsForPropertyEditors, screenWithSection } from 'mock/storeData';

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

describe('attributesHaveChanged function', () => {
    it('Returns false if both objects are empty', () => {
        const foo = {};
        const bar = {};
        expect(attributesHaveChanged(foo, bar)).toBe(false);
    });
    it('Returns false if both objects have identical key value pairs', () => {
        const foo = { a: '1', b: 2 };
        const bar = { a: '1', b: 2 };
        expect(attributesHaveChanged(foo, bar)).toBe(false);
    });
    it('Returns true if both objects have 1 different value', () => {
        const foo = { a: '1', b: 2 };
        const bar = { a: '1', b: 3 };
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns true if 2nd object has 1 more key value pair', () => {
        const foo = { a: '1' };
        const bar = { a: '1', b: 3 };
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns true if 1st object has 1 more key value pair', () => {
        const foo = { a: '1', b: 2 };
        const bar = { a: '1' };
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns true if 1st object is not empty and 2nd is empty', () => {
        const foo = { a: '1' };
        const bar = {};
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns true if 1st object is empty and 2nd is not empty', () => {
        const foo = {};
        const bar = { a: '1' };
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns true if objects have same number of keys but keys are different', () => {
        const foo = { a: '1', b: 2 };
        const bar = { a: '1', c: 2 };
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns false if objects have same key value pairs but declared in a different order', () => {
        const foo = { b: 2, a: 1 };
        const bar = { a: 1, b: 2 };
        expect(attributesHaveChanged(foo, bar)).toBe(false);
    });
    it('Returns true if 2nd object null and 1st is not', () => {
        const foo = { a: '1' };
        const bar = null;
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
    it('Returns true if 1st object null and 2nd is not', () => {
        const foo = null;
        const bar = { a: '1' };
        expect(attributesHaveChanged(foo, bar)).toBe(true);
    });
});
describe('getAllScreenFields function', () => {
    it('Returns a flattened list of screen fields', () => {
        const screen = elementsForPropertyEditors[screenWithSection.name];
        const fields = getAllScreenFields(screen.fields);
        expect(fields).toHaveLength(12);
        expect(fields[0].fieldType).toEqual('RegionContainer');
        expect(fields[1].fieldType).toEqual('InputField');
        expect(fields[4].fieldType).toEqual('Region');
        expect(fields[11].fieldType).toEqual('DropdownBox');
    });
});
