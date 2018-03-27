import { filterMatches } from 'builder_platform_interaction-expression-utils';

const filterTextName = 'Name';
const filterTextStr = 'Str';

const menuData = [
    {
        label: 'SObject Variables',
        items: [
            {
                type: 'option-card',
                text: 'FirstName',
                iconName: 'standard:account',
                subText: 'First Name',
                value: 'MyAccount.FirstName'
            },
            {
                type: 'option-card',
                text: 'LastName',
                iconName: 'standard:account',
                subText: 'Last Name',
                value: 'MyAccount.LastName'
            },
            {
                type: 'option-card',
                text: 'AnnualRevenue',
                iconName: 'standard:account',
                subText: 'Annual Revenue',
                value: 'MyAccount.AnnualRevenue'
            },
        ]
    },
    {
        label: 'Variables',
        items: [
            {
                type: 'option-card',
                text: 'MyName',
                iconName: 'utility:text_color',
                subText: 'String',
                value: 'MyVar1'
            },
            {
                type: 'option-card',
                text: 'MyNumber2',
                iconName: 'utility:number',
                subText: 'Number',
                value: 'MyNumber2'
            },
            {
                type: 'option-card',
                text: 'StartDateVar',
                iconName: 'utility:date',
                subText: 'Date',
                value: 'StartDateVar'
            },
        ]
    }
];

const filteredTextName = {
    highlight: true,
    text: 'Name'
};

const filteredTextString = {
    highlight: true,
    text: 'Str'
};

describe('Combobox Search Library', () => {
    describe('Filter Matches', () => {
        it('Should return a new array.', () => {
            const filteredArray = filterMatches(filterTextName, menuData);
            expect(filteredArray).not.toBe(menuData);
        });

        it('New array should have 2 groups.', () => {
            const filteredArray = filterMatches(filterTextName, menuData);
            expect(filteredArray).toHaveLength(2);
        });

        it('New array should contain 2 items in first group.', () => {
            const filteredArray = filterMatches(filterTextName, menuData);
            expect(filteredArray[0].items).toHaveLength(2);
        });

        it('New array should contain 1 item in second group.', () => {
            const filteredArray = filterMatches(filterTextName, menuData);
            expect(filteredArray[1].items).toHaveLength(1);
        });

        it('New array should have filterText highlighted in text & subtext in group items.', () => {
            const filteredArray = filterMatches(filterTextName, menuData);
            filteredArray.forEach(group => {
                group.items.every(item => {
                    return expect(item.text).toContainEqual(filteredTextName) &&
                        expect(item.subText).toContainEqual(filteredTextName);
                });
            });
        });

        it('Second search result should have highlight cleared from previous search.', () => {
            let filteredArray = filterMatches(filterTextName, menuData);
            filteredArray = filterMatches(filterTextStr, menuData);
            filteredArray.forEach(group => {
                group.items.every(item => {
                    return expect(item.text).not.toContainEqual(filteredTextName) &&
                        expect(item.subText).toContainEqual(filteredTextString);
                });
            });
        });
    });
});