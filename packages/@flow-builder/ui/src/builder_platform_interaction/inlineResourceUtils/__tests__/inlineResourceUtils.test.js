import { getInlineResource } from '../inlineResourceUtils';
describe('inline resource utils ', () => {
    it('throws an error if no resource guid is given ', () => {
        expect(() => getInlineResource()).toThrowError(
            'Resource is not defined'
        );
    });
    it('should return undefined if the menu does not have the resource ', () => {
        expect(getInlineResource(123)).toBe(undefined);
    });
    it('should return the resource if it is found in the mneu data ', () => {
        const target = { value: 2 };
        const resources = [
            { items: [{ value: 4 }, { value: 5 }] },
            { items: [{ value: 3 }, target, { value: 1 }] }
        ];
        expect(getInlineResource(2, resources)).toBe(target);
    });
    it('should return the undefined if passed menu data but the resource doesnt exist ', () => {
        const target = { value: 22 };
        const resources = [
            { items: [{ value: 4 }, { value: 5 }] },
            { items: [{ value: 3 }, target, { value: 1 }] }
        ];
        expect(getInlineResource(2, resources)).toBe(undefined);
    });
});
