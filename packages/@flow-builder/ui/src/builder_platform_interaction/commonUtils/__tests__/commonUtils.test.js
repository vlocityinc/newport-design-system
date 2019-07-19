import { memoize } from '../commonUtils';

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