import { generateGuid } from '../guidGenerator';

let testCounter = 3;
const next = function () {
    return String(testCounter++);
};

describe('Guid Generator', () => {
    it('Handles nulls', () => {
        expect(generateGuid(null)).toEqual('uid_0');
        expect(generateGuid()).toEqual('uid_1');
    });

    it('Handles numbers', () => {
        expect(generateGuid('123984')).toEqual('uid_2');
    });

    it('Increments', () => {
        let i = 0;
        for (i = 0; i < 100; ++i) {
            expect(generateGuid()).toEqual('uid_' + next());
        }
    });

    it('Handles strings that might include numbers', () => {
        expect(generateGuid('Assignment')).toEqual('Assignment_' + next());
        expect(generateGuid('Assig5567234__*&^%#$nment')).toEqual('Assignment_' + next());
    });
});
