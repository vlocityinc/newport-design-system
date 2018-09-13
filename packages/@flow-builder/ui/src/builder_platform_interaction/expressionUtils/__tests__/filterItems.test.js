import { filterMatches } from "builder_platform_interaction/expressionUtils";

const filterText = {
    name: 'Name',
    str: 'str',
    space: ' ',
    category: 'SObject',
    curlyBraces: '{',
    specialChar: '@#$%',
    newResource: 'new resource'
};

const menuData = [
    {
        items: [
            {
                type: 'option-inline',
                text: 'New Resource',
                iconName: 'utility:add',
                value: 'NewResource'
            }
        ]
    },
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
            {
                type: 'option-card',
                text: 'a!@#$%^_)(*&:',
                subText: 'Currency_{[-,.',
                value: 'SpecialCharVar'
            }
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

const filteredTextNewResource = {
    highlight: true,
    text: 'New Resource'
};

const labelSObjectVariables = 'SObject Variables';
const labelVariables = 'Variables';

describe('Combobox Search Library', () => {
    describe('Filter Matches', () => {
        it('Should return a new array.', () => {
            const filteredArray = filterMatches(filterText.name, menuData);
            expect(filteredArray).not.toBe(menuData);
        });

        it('New array should have 2 groups.', () => {
            const filteredArray = filterMatches(filterText.name, menuData);
            expect(filteredArray).toHaveLength(2);
        });

        it('New array should contain 2 items in first group.', () => {
            const filteredArray = filterMatches(filterText.name, menuData);
            expect(filteredArray[0].items).toHaveLength(2);
        });

        it('New array should contain 1 item in second group.', () => {
            const filteredArray = filterMatches(filterText.name, menuData);
            expect(filteredArray[1].items).toHaveLength(1);
        });

        it('New array should have filterText highlighted in text & subtext in group items.', () => {
            const filteredArray = filterMatches(filterText.name, menuData);
            filteredArray.forEach(group => {
                group.items.every(item => {
                    return expect(item.text).toContainEqual(filteredTextName) &&
                        expect(item.subText).toContainEqual(filteredTextName);
                });
            });
        });

        it('Second search result should have highlight cleared from previous search.', () => {
            let filteredArray = filterMatches(filterText.name, menuData);
            filteredArray = filterMatches(filterText.str, menuData);
            filteredArray.forEach(group => {
                group.items.every(item => {
                    return expect(item.text).not.toContainEqual(filteredTextName) &&
                        expect(item.subText).toContainEqual(filteredTextString);
                });
            });
        });

        it('New array should have group and items matching space search text.', () => {
            const filteredArray = filterMatches(filterText.space, menuData);
            expect(filteredArray).toHaveLength(2);
            expect(filteredArray[1].label).toBe(labelSObjectVariables);
            expect(filteredArray[1].items).toHaveLength(3);
        });

        it('Search should not be performed on category name.', () => {
            const filteredArray = filterMatches(filterText.category, menuData);
            expect(filteredArray).toHaveLength(0);
        });

        it('Search should work for open curly braces.', () => {
            const filteredArray = filterMatches(filterText.curlyBraces, menuData);
            expect(filteredArray).toHaveLength(1);
            expect(filteredArray[0].label).toBe(labelVariables);
            expect(filteredArray[0].items).toHaveLength(1);
        });

        it('Search should work for special chars.', () => {
            const filteredArray = filterMatches(filterText.specialChar, menuData);
            expect(filteredArray).toHaveLength(1);
            expect(filteredArray[0].label).toBe(labelVariables);
            expect(filteredArray[0].items).toHaveLength(1);
        });

        it('Search should work option inline items.', () => {
            const filteredArray = filterMatches(filterText.newResource, menuData);
            expect(filteredArray).toHaveLength(1);
            expect(filteredArray[0].items).toHaveLength(1);
            expect(filteredArray[0].items[0].text).toContainEqual(filteredTextNewResource);
        });
    });
});