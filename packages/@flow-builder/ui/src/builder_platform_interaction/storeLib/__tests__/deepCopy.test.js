import { deepCopy } from '../deepCopy';

const obj = {
    title: 'Flow Builder',
    elements: [
        {
            name: 'Assignment'
        },
        {
            name: 'Decision'
        }
    ]
};

describe('Deep copy function', () => {
    const newObj = deepCopy(obj);

    it('returns new copy of the object', () => {
        expect(newObj).not.toBe(obj);
    });

    it('returns new copy of elements array', () => {
        expect(newObj.elements).not.toBe(obj.elements);
    });

    it('returns new copy of an item in an elements array', () => {
        expect(newObj.elements[0]).not.toBe(obj.elements[0]);
    });

    it('returns same value of an item in an elements array', () => {
        expect(newObj.elements[0].name).toBe(obj.elements[0].name);
    });
});
