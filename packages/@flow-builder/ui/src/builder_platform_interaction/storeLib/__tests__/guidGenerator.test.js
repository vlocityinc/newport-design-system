import { generateGuid } from '../guidGenerator';

let testCounter = 1;
const next = function () {
    return String(testCounter++);
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Guid Generator', () => {
    it('Handles nulls', () => {
        expect(generateGuid(null)).toMatch(uuidRegex);
        expect(generateGuid()).toMatch(uuidRegex);
    });

    it('Handles numbers', () => {
        expect(generateGuid('123984')).toMatch('uid_0');
    });

    it('Increments', () => {
        let i = 0;
        for (i = 0; i < 100; ++i) {
            expect(generateGuid('uid')).toEqual('uid_' + next());
        }
    });

    it('Handles strings that might include numbers', () => {
        expect(generateGuid('Assignment')).toEqual('Assignment_' + next());
        expect(generateGuid('Assig5567234__*&^%#$nment')).toEqual('Assignment_' + next());
    });
});
