import { createItem, createLevel, createSection, flatten, isSection } from "../paletteLib";

const ELEMENT_DATA = [
    // Example of a section with deeply nested items.
    {
        "guid": "myGuid1",
        "label": "myLabel1",
        "_children": [
            {
                "guid": "myGuid2",
                "label": "myLabel2",
                "_children": [
                    // Items with a description should have the description in
                    // the flattened version.
                    {
                        "elementType": "Variable",
                        "guid": "myGuid3",
                        "label": "myLabel3",
                        "description": "myDescription",
                        "iconName": "myIconName"
                    },
                    // Items without a description should have an empty string
                    // as a description in the flattened version.
                    {
                        "elementType": "Variable",
                        "guid": "myGuid4",
                        "label": "myLabel4",
                        "iconName": "myIconName"
                    }
                ]
            }
        ]
    },
    // Example of a section that is not deeply nested.
    {
        "guid": "myGuid5",
        "label": "myLabel5",
        "_children": [
            {
                "elementType": "Variable",
                "guid": "myGuid6",
                "label": "myLabel6",
                "iconName": "myIconName"
            },
            {
                "elementType": "Variable",
                "guid": "myGuid7",
                "label": "myLabel7",
                "iconName": "myIconName"
            }
        ]
    },
    // Example of an item at the same level as sections.
    {
        "elementType": "Variable",
        "guid": "leaf",
        "label": "myLabel8",
        "iconName": "myIconName"
    }
];

const COLLAPSED_SECTIONS = {
    "myLabel5": true
};

const ELEMENT_DATA_FLATTENED = [
    {
        "isSection": true,
        "id": "myLabel1",
        "key": "myGuid1",
        "level": 1,
        "posinset": 1,
        "setsize": 3,
        "toggleAlternativeText": "FlowBuilderLeftPanel.palleteSectionToggleCollapseText myLabel1",
        "label": "myLabel1",
        "expanded": true,
        "visibleItems": 1
    },
    {
        "isSection": true,
        "id": "myLabel2",
        "key": "myGuid2",
        "level": 2,
        "posinset": 1,
        "setsize": 1,
        "toggleAlternativeText": "FlowBuilderLeftPanel.palleteSectionToggleCollapseText myLabel2",
        "label": "myLabel2",
        "expanded": true,
        "visibleItems": 2
    },
    {
        "isSection": false,
        "key": "myGuid3",
        "level": 3,
        "posinset": 1,
        "setsize": 2,
        "label": "myLabel3",
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
        "label": "myLabel4",
        "description": "",
        "elementType": "Variable",
        "iconName": "myIconName"
    },
    {
        "isSection": true,
        "id": "myLabel5",
        "key": "myGuid5",
        "level": 1,
        "posinset": 2,
        "setsize": 3,
        "toggleAlternativeText": "FlowBuilderLeftPanel.palleteSectionToggleExpandText myLabel5",
        "label": "myLabel5",
        "expanded": false,
        "visibleItems": 2
    },
    {
        "isSection": false,
        "key": "leaf",
        "level": 1,
        "posinset": 3,
        "setsize": 3,
        "label": "myLabel8",
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

    describe('createItem', () => {
        it('converts a resource item with a description to a palette item', () => {
            const input = ELEMENT_DATA[0]._children[0]._children[0];
            const expected = ELEMENT_DATA_FLATTENED[2];
            expect(createItem(input, 3, 1, 2)).toEqual(expected);
        });

        it('converts a resource item without a description to a palette item', () => {
            const input = ELEMENT_DATA[0]._children[0]._children[1];
            const expected = ELEMENT_DATA_FLATTENED[3];
            expect(createItem(input, 3, 2, 2)).toEqual(expected);
        });
    });

    describe('createSection', () => {
        it('converts a resource section to a collapsed palette section', () => {
            const input = ELEMENT_DATA[1];
            const expected = ELEMENT_DATA_FLATTENED.slice(4, 5);
            expect(createSection(input, { collapsedSections: COLLAPSED_SECTIONS }, 1, 2, 3)).toEqual(expected);
        });

        it('converts a resource section to an expanded palette section', () => {
            const input = ELEMENT_DATA[0]._children[0];
            const expected = ELEMENT_DATA_FLATTENED.slice(1, 4);
            expect(createSection(input, { collapsedSections: {} }, 2, 1, 1)).toEqual(expected);
        });

        it('converts a resource section to a palette section with section item count', () => {
            const input = ELEMENT_DATA[1];
            const expected = [
                {
                    "isSection": true,
                    "id": "myLabel5",
                    "key": "myGuid5",
                    "level": 1,
                    "posinset": 2,
                    "setsize": 3,
                    "toggleAlternativeText": "FlowBuilderLeftPanel.palleteSectionToggleExpandText myLabel5",
                    "label": "myLabel5 (2)",
                    "expanded": false,
                    "visibleItems": 2
                }
            ];
            expect(createSection(input, { collapsedSections: COLLAPSED_SECTIONS, showSectionItemCount: true }, 1, 2, 3)).toEqual(expected);
        });
    });

    describe('createLevel', () => {
        it('creates a level using the given resource section', () => {
            const input = [
                {
                    "guid": "myGuid5",
                    "label": "myLabel5",
                    "_children": [
                        {
                            "elementType": "Variable",
                            "guid": "myGuid6",
                            "label": "myLabel6",
                            "description": "myDescription",
                            "iconName": "myIconName"
                        }
                    ]
                }
            ];
            const expected = [
                {
                    "isSection": true,
                    "id": "myLabel5",
                    "key": "myGuid5",
                    "level": 3,
                    "posinset": 1,
                    "setsize": 1,
                    "toggleAlternativeText": "FlowBuilderLeftPanel.palleteSectionToggleCollapseText myLabel5",
                    "label": "myLabel5",
                    "expanded": true,
                    "visibleItems": 1
                },
                {
                    "isSection": false,
                    "key": "myGuid6",
                    "level": 4,
                    "posinset": 1,
                    "setsize": 1,
                    "label": "myLabel6",
                    "description": "myDescription",
                    "elementType": "Variable",
                    "iconName": "myIconName"
                }
            ];
            expect(createLevel(input, { collapsedSections: {} }, 3)).toEqual(expected);
        });

        it('creates a level using the given resource item', () => {
            const input = [
                {
                    "elementType": "Variable",
                    "guid": "leaf",
                    "label": "myLabel",
                    "iconName": "myIconName"
                }
            ];
            const expected = [
                {
                    "isSection": false,
                    "key": "leaf",
                    "level": 2,
                    "posinset": 1,
                    "setsize": 1,
                    "label": "myLabel",
                    "description": "",
                    "elementType": "Variable",
                    "iconName": "myIconName"
                }
            ];
            expect(createLevel(input, { collapsedSections: {} }, 2)).toEqual(expected);
        });
    });

    describe('flatten', () => {
        it('should create a tree with a deeply nested, expanded, and collapsed sections', () => {
            expect(flatten(ELEMENT_DATA, { collapsedSections: COLLAPSED_SECTIONS })).toEqual(ELEMENT_DATA_FLATTENED);
        });
    });
});