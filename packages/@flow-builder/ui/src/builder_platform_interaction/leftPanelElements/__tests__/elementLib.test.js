import { getElementSections } from "../elementLib";

const ELEMENTS = [
    {
        "description":"Collect information from or display information to the flow user.",
        "section":"User Interaction",
        "label":"Screen",
        "elementType":"SCREEN"
    },
    {
        "description":"Set variable values.",
        "section":"Logic",
        "label":"Assignment",
        "elementType":"ASSIGNMENT"
    },
    {
        "description":"Create paths for the flow to take based on conditions you set.",
        "section":"Logic",
        "label":"Decision",
        "elementType":"DECISION"
    }
];

const SECTIONS = [
    {
        "_children": [{
            "description": "Collect information from or display information to the flow user.",
            "label": "Screen",
            "elementType": "SCREEN",
            "guid": "ELEMENTSPALETTEITEM_0",
            "iconName": "standard:screen"
        }],
        "guid": "ELEMENTSPALETTESECTION_3",
        "label": "User Interaction"
    },
    {
        "_children": [{
            "description": "Set variable values.",
            "label": "Assignment",
            "elementType": "ASSIGNMENT",
            "guid": "ELEMENTSPALETTEITEM_1",
            "iconName": "standard:assignment"
        },
        {
            "description": "Create paths for the flow to take based on conditions you set.",
            "label": "Decision",
            "elementType": "DECISION",
            "guid": "ELEMENTSPALETTEITEM_2",
            "iconName": "standard:decision"
        }],
        "guid": "ELEMENTSPALETTESECTION_4",
        "label": "Logic"
    }
];

describe('element-lib', () => {
    describe('When no elements are available', () => {
        it('returns an empty list when elements is undefined', () => {
            expect(getElementSections()).toEqual([]);
        });

        it('returns an empty list when elements is null', () => {
            expect(getElementSections(null)).toEqual([]);
        });

        it('returns an empty list when elements is empty', () => {
            expect(getElementSections({})).toEqual([]);
        });
    });

    describe('When elements are available', () => {
        it('returns the expect sections list', () => {
            expect(getElementSections(ELEMENTS)).toEqual(SECTIONS);
        });
    });
});