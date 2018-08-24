import { flatten, isSection } from '../palette-lib';

const ELEMENT_DATA = [
    // Example of a section with deeply nested items.
    {
        "guid": "myGuid1",
        "label": "myLabel",
        "_children": [
            {
                "guid": "myGuid2",
                "label": "myLabel",
                "_children": [
                    // Items with a description should have the description in
                    // the flattened version.
                    {
                        "elementType": "Variable",
                        "guid": "myGuid3",
                        "label": "myLabel",
                        "description": "myDescription",
                        "iconName": "myIconName"
                    },
                    // Items without a description should have an empty string
                    // as a description in the flattened version.
                    {
                        "elementType": "Variable",
                        "guid": "myGuid4",
                        "label": "myLabel",
                        "iconName": "myIconName"
                    }
                ]
            }
        ]
    },
    // Example of a section that is not deeply nested.
    {
        "guid": "myGuid5",
        "label": "myLabel",
        "_children": [
            {
                "elementType": "Variable",
                "guid": "myGuid6",
                "label": "myLabel",
                "iconName": "myIconName"
            },
            {
                "elementType": "Variable",
                "guid": "myGuid7",
                "label": "myLabel",
                "iconName": "myIconName"
            }
        ]
    },
    // Example of an item at the same level as sections.
    {
        "elementType": "Variable",
        "guid": "leaf",
        "label": "myLabel",
        "iconName": "myIconName"
    }
];

const COLLAPSED_SECTIONS = {
    "myGuid5": true
};

const ELEMENT_DATA_FLATTENED = [
    {
        "isSection": true,
        "key": "myGuid1",
        "level": 1,
        "posinset": 1,
        "setsize": 3,
        "label": "myLabel",
        "expanded": true,
        "visibleItems": 1
    },
    {
        "isSection": true,
        "key": "myGuid2",
        "level": 2,
        "posinset": 1,
        "setsize": 1,
        "label": "myLabel",
        "expanded": true,
        "visibleItems": 2
    },
    {
        "isSection": false,
        "key": "myGuid3",
        "level": 3,
        "posinset": 1,
        "setsize": 2,
        "label": "myLabel",
        "description": "myDescription",
        "elementType": "Variable",
        "iconName": "myIconName"
    },
    {
        "isSection": false,
        "key": "myGuid4",
        "level": 3,
        "posinset": 2,
        "setsize": 2,
        "label": "myLabel",
        "description": "",
        "elementType": "Variable",
        "iconName": "myIconName"
    },
    {
        "isSection": true,
        "key": "myGuid5",
        "level": 1,
        "posinset": 2,
        "setsize": 3,
        "label": "myLabel",
        "expanded": false,
        "visibleItems": 2
    },
    {
        "isSection": false,
        "key": "leaf",
        "level": 1,
        "posinset": 3,
        "setsize": 3,
        "label": "myLabel",
        "description": "",
        "elementType": "Variable",
        "iconName": "myIconName"
    }
];

describe('palette-lib', () => {
    describe('isSection', () => {
        it('should not be considered a section when row._children is not present', () => {
            const row = {
                guid : 'RESOURCEPALETTESECTION_1',
                label : 'Category'
            };
            expect(isSection(row)).toBe(false);
        });

        it('should not be considered a section when row._children is not an array', () => {
            const row = {
                guid : 'RESOURCEPALETTESECTION_1',
                label : 'Category',
                _children: false
            };
            expect(isSection(row)).toBe(false);
        });

        it('should not be considered a section when row._children is empty', () => {
            const row = {
                guid : 'RESOURCEPALETTESECTION_1',
                label : 'Category',
                _children: []
            };
            expect(isSection(row)).toBe(false);
        });

        it('should be considered a section when row._children is non-empty', () => {
            const row = {
                guid : 'RESOURCEPALETTESECTION_1',
                label : 'Category',
                _children: [{}]
            };
            expect(isSection(row)).toBe(true);
        });
    });

    describe('flatten', () => {
        it('should create a tree with a deeply nested, expanded, and collapsed sections', () => {
            expect(flatten(ELEMENT_DATA, COLLAPSED_SECTIONS)).toEqual(ELEMENT_DATA_FLATTENED);
        });
    });
});