import { createElement } from 'lwc';
import RecordLookupEditor from '../recordLookupEditor';
import { recordLookupReducer } from '../recordLookupReducer';
import {
    EditElementEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { lookupRecordAutomaticOutput } from 'mock/storeData';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () =>
    require('builder_platform_interaction_mocks/fieldPicker')
);
jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function () {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    };
    const getStore = function () {
        return {
            getCurrentState
        };
    };
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

function createComponentForTest(
    node,
    mode = EditElementEvent.EVENT_NAME,
    processType = 'Flow'
) {
    const el = createElement(
        'builder_platform_interaction-record-lookup-editor',
        { is: RecordLookupEditor }
    );
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        '../../processTypeLib/processTypeLib.js'
    );
    const FLOW_AUTOMATIC_OUTPUT_HANDLING =
        actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest
            .fn()
            .mockReturnValue(FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED)
    };
});

describe('record-lookup-reducerAutomatic Mode', () => {
    let recordLookupEditor, recordLookupNode, newState;
    beforeAll(() => {
        recordLookupNode = getElementForPropertyEditor(
            lookupRecordAutomaticOutput
        );
        recordLookupEditor = createComponentForTest(
            recordLookupNode,
            EditElementEvent.EVENT_NAME
        );
    });
    describe('handle property changed event', () => {
        beforeEach(() => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'object',
                    value: 'Account History'
                }
            };
            newState = recordLookupReducer(recordLookupEditor.node, event);
        });
        it('not change', () => {
            expect(newState.queriedFields).toBeNull();
        });
    });
});
