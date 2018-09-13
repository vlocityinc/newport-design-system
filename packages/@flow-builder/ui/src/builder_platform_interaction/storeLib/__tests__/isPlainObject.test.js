import { isPlainObject } from '../isPlainObject';

const plainObject = {
    name: 'Coding is easy, designing is hard'
};

const randomFunction = () => {
    return 'Coding is easy, designing is hard';
};

describe('isPlainObject function', () => {
    it('returns true when object is a plain object', () => {
        const result = isPlainObject(plainObject);
        expect(result).toBeTruthy();
    });

    it('return false when object is a function', () => {
        const result = isPlainObject(randomFunction);
        expect(result).toBeFalsy();
    });

    it('return false when object is null', () => {
        const result = isPlainObject();
        expect(result).toBeFalsy();
    });
});
