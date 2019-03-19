import { getElementSections } from "../elementLib";
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = require.requireActual('../../storeLib/storeLib.js');
    return {
        deepCopy: actual.deepCopy,
        generateGuid: jest.fn().mockImplementation(() => {
            return "testGUID";
        })
    };
});

const ELEMENTS = [
    {
        "elementType": ELEMENT_TYPE.SCREEN
    },
    {
        "elementType": ELEMENT_TYPE.ASSIGNMENT
    },
    {
        "elementType": ELEMENT_TYPE.DECISION
    }
];

const SECTIONS = [
    {
        "_children": [{
            "elementType": ELEMENT_TYPE.SCREEN,
            "guid": "testGUID",
            "iconName": "standard:screen",
            "dragImageSrc": "/flow/icons/large/screen.png"
        }],
        "guid": "testGUID"
    },
    {
        "_children": [{
            "elementType": ELEMENT_TYPE.ASSIGNMENT,
            "guid": "testGUID",
            "iconName": "standard:assignment",
            "dragImageSrc": "/flow/icons/large/assignment.png"
        },
        {
            "elementType": ELEMENT_TYPE.DECISION,
            "guid": "testGUID",
            "iconName": "standard:decision",
            "dragImageSrc": "/flow/icons/large/decision.png"
        }],
        "guid": "testGUID"
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
            expect(getElementSections(ELEMENTS)).toMatchObject(SECTIONS);
        });
    });
});