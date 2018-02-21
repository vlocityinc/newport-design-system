import { filterMatches } from '../search';

const filterText = 'Name';
const menuData = [
    {
        type: 'option-inline',
        iconName: 'utility:search',
        text: 'Create New Resource',
        value: 'actionSearchAdvanced'
    },
    {
        type: 'option-card',
        text: 'FirstName',
        iconName: 'standard:account',
        subText: 'First Name',
        value: '{!MyAccount.FirstName}'
    },
    {
        type: 'option-card',
        text: 'LastName',
        iconName: 'standard:account',
        subText: 'Last Name',
        value: '{!MyAccount.LastName}'
    },
    {
        type: 'option-card',
        text: 'AnnualRevenue',
        iconName: 'standard:account',
        subText: 'Annual Revenue',
        value: '{!MyAccount.AnnualRevenue}'
    }
];

const filteredText = {
    highlight: true,
    text: 'Name'
};

describe('Combobox Search Library', () => {
    describe('Filter Matches', () => {
        it('Should return a new array.', () => {
            const filteredArray = filterMatches(filterText, menuData);
            expect(filteredArray).not.toBe(menuData);
        });

        it('New array should have length of 2.', () => {
            const filteredArray = filterMatches(filterText, menuData);
            expect(filteredArray).toHaveLength(2);
        });

        it('New array should have filterText highlighted in text & subtext.', () => {
            const filteredArray = filterMatches(filterText, menuData);
            filteredArray.every(item => {
                return expect(item.text).toContainEqual(filteredText) &&
                    expect(item.subText).toContainEqual(filteredText);
            });
        });
    });
});