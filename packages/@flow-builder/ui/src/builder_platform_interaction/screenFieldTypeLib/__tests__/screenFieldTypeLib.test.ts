// @ts-nocheck
import * as contextLibMock from 'builder_platform_interaction/contextLib';
import { getSupportedScreenFieldTypes } from 'builder_platform_interaction/screenFieldTypeLib';

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasFlowScreenSections: jest.fn()
    });
});

const mockSupportedScreenTypes = [
    {
        isElementSubtype: false,
        name: 'ComponentChoice',
        attributes: 'dummyAttributes',
        classification: 'Child',
        elementType: 'ScreenField'
    },
    {
        isElementSubtype: false,
        name: 'ComponentMultiChoice',
        attributes: 'dummyAttributes',
        classification: 'Child',
        elementType: 'ScreenField'
    },
    {
        isElementSubtype: false,
        name: 'ComponentDisplay',
        attributes: 'dummyAttributes',
        classification: 'Child',
        elementType: 'ScreenField'
    },
    {
        isElementSubtype: false,
        name: 'Region',
        attributes: 'dummyAttributes',
        classification: 'Child',
        elementType: 'ScreenField'
    },
    {
        isElementSubtype: false,
        name: 'RegionContainer',
        attributes: 'dummyAttributes',
        classification: 'Child',
        elementType: 'ScreenField'
    }
];

jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetchOnce: () => {
            return Promise.resolve(mockSupportedScreenTypes);
        },
        SERVER_ACTION_TYPE: jest.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE
    };
});

describe('getAllScreenFieldTypes function', () => {
    let processType, triggerType;

    beforeEach(() => {
        processType = 'dummyProcessType';
        triggerType = 'dummyTriggerType';
    });

    it('when sections perm is disabled, section field type is not in supported screen types', async () => {
        contextLibMock.orgHasFlowScreenSections.mockReturnValue(false);
        const supportedTypes = await getSupportedScreenFieldTypes(processType, triggerType);
        expect(supportedTypes).not.toEqual(
            expect.arrayContaining([
                {
                    isElementSubtype: false,
                    name: 'RegionContainer',
                    attributes: 'dummyAttributes',
                    classification: 'Child',
                    elementType: 'ScreenField'
                }
            ])
        );
    });

    it('when section perm is enabled, section field type is in supported screen types', async () => {
        contextLibMock.orgHasFlowScreenSections.mockReturnValue(true);
        const supportedTypes = await getSupportedScreenFieldTypes(processType, triggerType);
        expect(supportedTypes).toEqual(
            expect.arrayContaining([
                {
                    isElementSubtype: false,
                    name: 'RegionContainer',
                    attributes: 'dummyAttributes',
                    classification: 'Child',
                    elementType: 'ScreenField'
                }
            ])
        );
    });
});
