import { searchMenuDataHelper } from '../expression-builder-utils';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-constant';
import { filterMatches } from 'builder_platform_interaction-data-mutation-lib';

/* MOCK DATA */

const mockMatches = [
    {
        // text that shows up in the combobox dropdown menu
        text: [
            {highlight: true, text: 'va'},
            {highlight: false, text: 'r1'}
        ],
        subText: [],
        // the value returned when the above text is selected
        value: 'var1',
        // display type of how the data is displayed in combobox dropdown menu
        type: 'option-card',
    }
];

// mock out the filterMatches dependency used by the function under test 'searchMenuDataHelper'
jest.mock('builder_platform_interaction-data-mutation-lib', () => {
    return {
        filterMatches: jest.fn()
    };
});
// mock the implementation of filterMatches to always return our mock match results
filterMatches.mockImplementation(() => {
    return mockMatches;
});

// get the constants for lhs, operator, using es6 object destructering
const { LEFT_HAND_SIDE: lhs, OPERATOR: operator } = EXPRESSION_PROPERTY_TYPE;

const mockItemObj = {
    [lhs]: {
        menudata: [
            {
                // category heading
                text: 'Variables',
                type: 'heading',
            },
            {
                // text that shows up in the combobox dropdown menu
                text: [
                    {highlight: false, text: 'var1'},
                ],
                subText: [],
                // the value returned when the above text is selected
                value: 'var1',
                // display type of how the data is displayed in combobox dropdown menu
                type: 'option-card',
            }
        ],
    },
    [operator]: {
        menudata: [
            {
                // category heading
                text: 'Variables',
                type: 'heading',
            },
            {
                // text that shows up in the combobox dropdown menu
                text: [
                    {highlight: false, text: 'var2'},
                ],
                subText: [],
                // the value returned when the above text is selected
                value: 'var2',
                // display type of how the data is displayed in combobox dropdown menu
                type: 'option-card',
            }
        ],
    }
};

const makeMockItem = () => JSON.parse(JSON.stringify(mockItemObj));

/** TESTS **/

describe('Search menu data utils', () => {
    it('returns a new iem after calling searchMenuDataHelper', () => {
        const mockItem = makeMockItem();
        const newItem = searchMenuDataHelper('', lhs, mockItem);
        expect(newItem).not.toBe(mockItem);
    });

    it('returns an unchanged item if given an undefined or invalid property name', () => {
        const mockItem = makeMockItem();
        const newItem = searchMenuDataHelper('', 'someFakePropertyName', mockItem);
        expect(newItem).toEqual(mockItem);
    });

    it('returns an empty object if given an undefined item', () => {
        const newItem = searchMenuDataHelper('', lhs, undefined);
        expect(newItem).toEqual({});
    });

    it('returns an unchanged item if given search text that is not a string', () => {
        const mockItem = makeMockItem();
        const newItem = searchMenuDataHelper(42, lhs, mockItem);
        expect(newItem).toEqual(mockItem);
    });

    it('sets the matches returned from filteredMatches to the item menudata', () => {
        const mockItem = makeMockItem();
        const newItem = searchMenuDataHelper('va', lhs, mockItem);
        expect(newItem[lhs].menudata).toEqual(mockMatches);
    });

    it('only sets the matches from filteredMatches to the right property type', () => {
        const mockItem = makeMockItem();
        const newItem = searchMenuDataHelper('va', operator, mockItem);
        expect(newItem[lhs].menudata).not.toEqual(newItem[operator].menudata);
    });
});
