// @ts-nocheck
import { debounce, memoize, removeDuplicates } from '../commonUtils';

const firstArr = [
    {
        name: 'Rad',
        greeting: 'lol',
        gender: 'male'
    },
    {
        name: 'Rad',
        greeting: 'sup',
        gender: 'female'
    },
    {
        name: 'Alex',
        car: 'BMW',
        company: 'Salesforce'
    },
    {
        name: 'Alex',
        greeting: 'lol'
    }
];

const secondArr = [
    {
        name: 'Rad',
        greeting: 'hi'
    },
    {
        name: 'Rad',
        greeting: 'lol',
        species: 'human'
    },
    {
        name: 'Alex',
        greeting: 'lol',
        species: 'human'
    }
];

describe('memoize', () => {
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

describe('debounce', () => {
    it('invokes callback after time delay completes', async () => {
        const callback = jest.fn();
        const debouncedCallback = debounce(callback, 250);
        debouncedCallback();
        await timeout(250);
        expect(callback).toHaveBeenCalled();
    });
    it('does not invoke callback before time delay completes', async () => {
        const callback = jest.fn();
        const debouncedCallback = debounce(callback, 250);
        debouncedCallback();
        expect(callback).not.toHaveBeenCalled();
    });
});

describe('removeDuplicates', () => {
    it('removes correct duplicates matched by given properties', () => {
        const dedupedArr = removeDuplicates(firstArr, secondArr, ['name', 'greeting']);
        const expectedArr = [
            {
                name: 'Rad',
                greeting: 'sup',
                gender: 'female'
            },
            {
                name: 'Alex',
                car: 'BMW',
                company: 'Salesforce'
            }
        ];
        expect(dedupedArr).toEqual(expectedArr);
    });
});

function timeout(ms) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    return new Promise((resolve) => setTimeout(resolve, ms));
}
