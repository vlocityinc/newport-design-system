import { getElementSections } from "../elementLib";

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = require.requireActual('builder_platform_interaction/storeLib');
    return {
        deepCopy: actual.deepCopy,
        generateGuid: jest.fn().mockImplementation(() => {
            return "testGUID";
        })
    };
});

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
            "guid": "testGUID",
            "iconName": "standard:screen",
            "dragImageSrc": "/flow/icons/large/screen.png"
        }],
        "guid": "testGUID",
        "label": "User Interaction"
    },
    {
        "_children": [{
            "description": "Set variable values.",
            "label": "Assignment",
            "elementType": "ASSIGNMENT",
            "guid": "testGUID",
            "iconName": "standard:assignment",
            "dragImageSrc": "/flow/icons/large/assignment.png"
        },
        {
            "description": "Create paths for the flow to take based on conditions you set.",
            "label": "Decision",
            "elementType": "DECISION",
            "guid": "testGUID",
            "iconName": "standard:decision",
            "dragImageSrc": "/flow/icons/large/decision.png"
        }],
        "guid": "testGUID",
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