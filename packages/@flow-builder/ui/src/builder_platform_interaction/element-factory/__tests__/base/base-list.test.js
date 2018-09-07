import { createListRowItem } from '../../base/base-list';

const listRowItem = {
    leftHandSide: '{!var1}',
    operator: 'equals',
    rightHandSide: 'Hello World',
    rightHandSideDataType: 'string'
};

describe('createListRowItem function', () => {
    it('returns a new list row item object when no argument is passed', () => {
        const expectedResult = {
            leftHandSide: '',
            operator: '',
            rightHandSide: '',
            rightHandSideDataType: 'string'
        };
        const actualResult = createListRowItem();
        expect(actualResult).toMatchObject(expectedResult);
    });

    it('returns a new list row item object when listRowItem is passed as argument', () => {
        const expectedResult = {
            leftHandSide: '{!var1}',
            operator: 'equals',
            rightHandSide: 'Hello World',
            rightHandSideDataType: 'string'
        };
        const actualResult = createListRowItem(listRowItem);
        expect(actualResult).not.toBe(expectedResult);
    });

    it('returns a new list row item object with same values when listRowItem is passed as argument', () => {
        const expectedResult = {
            leftHandSide: '{!var1}',
            operator: 'equals',
            rightHandSide: 'Hello World',
            rightHandSideDataType: 'string'
        };
        const actualResult = createListRowItem(listRowItem);
        expect(actualResult).toMatchObject(expectedResult);
    });
});