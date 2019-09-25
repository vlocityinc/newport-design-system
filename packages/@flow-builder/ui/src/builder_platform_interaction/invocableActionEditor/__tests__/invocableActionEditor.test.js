import { createElement } from 'lwc';
import InvocableActionEditor from '../invocableActionEditor';
import { mockActions } from 'mock/calloutData';
import { chatterPostActionParameters as mockActionParameters } from 'serverData/GetInvocableActionParameters/chatterPostActionParameters.json';
import {
    ClosePropertyEditorEvent,
    CannotRetrieveCalloutParametersEvent,
    SetPropertyEditorTitleEvent
} from 'builder_platform_interaction/events';
import {
    untilNoFailure,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { clearInvocableActionCachedParameters } from 'builder_platform_interaction/invocableActionLib';
import { getProcessTypeAutomaticOutPutHandlingSupport } from 'builder_platform_interaction/processTypeLib';

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        '../../processTypeLib/processTypeLib.js'
    );
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING: actual.FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn()
    };
});

const commonUtils = require.requireActual('../../commonUtils/commonUtils.js');
commonUtils.format = jest
    .fn()
    .mockImplementation(
        (formatString, ...args) => formatString + '(' + args.toString() + ')'
    );

const defaultNode = {
    actionName: { value: 'chatterPost', error: null },
    actionType: { value: 'chatterPost', error: null },
    description: { value: 'This is a description', error: null },
    elementType: ELEMENT_TYPE.ACTION_CALL,
    guid: '66b95c2c-468d-466b-baaf-5ad964be585e',
    isCanvasElemen: true,
    label: { value: 'Post to Chatter', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'Post_to_Chatter', error: null },
    inputParameters: [
        {
            rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
            name: {
                value: 'subjectNameOrId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
            name: {
                value: 'text',
                error: null
            },
            value: {
                value: 'This is a message',
                error: null
            },
            valueDataType: 'String'
        }
    ],
    outputParameters: [
        {
            rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
            name: {
                value: 'feedItemId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        }
    ]
};

const actionWithAutomaticOutputNode = {
    actionName: { value: 'chatterPost', error: null },
    actionType: { value: 'chatterPost', error: null },
    description: { value: 'This is a description', error: null },
    elementType: ELEMENT_TYPE.ACTION_CALL,
    guid: '66b95c2c-468d-466b-baaf-5ad964be585e',
    isCanvasElemen: true,
    label: { value: 'Post to Chatter', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'Post_to_Chatter', error: null },
    storeOutputAutomatically: true,
    inputParameters: [
        {
            rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
            name: {
                value: 'subjectNameOrId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
            name: {
                value: 'text',
                error: null
            },
            value: {
                value: 'This is a message',
                error: null
            },
            valueDataType: 'String'
        }
    ],
    outputParameters: []
};

const createComponentUnderTest = (node, { isNewMode = false } = {}) => {
    const el = createElement(
        'builder_platform_interaction-invocable-action-editor',
        { is: InvocableActionEditor }
    );
    Object.assign(el, { node, isNewMode });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor'
};

let mockActionParametersPromise = Promise.resolve(mockActionParameters);
let mockActionsPromise = Promise.resolve(mockActions);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual(
        '../../serverDataLib/serverDataLib.js'
    );
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: serverActionType => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    return mockActionsPromise;
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS:
                    return mockActionParametersPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

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

const getBaseCalloutEditor = actionEditor => {
    return actionEditor.shadowRoot.querySelector(selectors.baseCalloutEditor);
};

describe('Invocable Action editor', () => {
    beforeEach(() => {
        clearInvocableActionCachedParameters();
    });
    afterEach(() => {
        mockActionParametersPromise = Promise.resolve(mockActionParameters);
        mockActionsPromise = Promise.resolve(mockActions);
    });
    it('should display a subtitle including the action call label', async () => {
        const actionEditorCmp = createComponentUnderTest(defaultNode);
        const baseCalloutEditorCmp = getBaseCalloutEditor(actionEditorCmp);
        await mockActionsPromise;
        await mockActionParametersPromise;
        expect(baseCalloutEditorCmp.subtitle).toBe(
            'FlowBuilderInvocableActionEditor.subtitle(Post to Chatter,FlowBuilderInvocableActionEditor.coreActionTypeLabel)'
        );
    });
    it('contains base callout editor', () => {
        const actionEditorCmp = createComponentUnderTest(defaultNode);
        const baseCalloutEditorCmp = getBaseCalloutEditor(actionEditorCmp);
        expect(baseCalloutEditorCmp).not.toBeNull();
    });
    it('should display a subtitle using the unique name if call to GET_INVOCABLE_ACTIONS failed', async () => {
        mockActionsPromise = Promise.reject();
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        await mockActionsPromise.catch(() => {
            const baseCalloutEditorCmp = getBaseCalloutEditor(actionEditorCmp);
            expect(baseCalloutEditorCmp.subtitle).toBe(
                'FlowBuilderInvocableActionEditor.subtitle(chatterPost,FlowBuilderInvocableActionEditor.coreActionTypeLabel)'
            );
        });
    });
    describe('Edit existing invocable action', () => {
        it('should dispatch a ClosePropertyEditorEvent if call to GET_INVOCABLE_ACTION_PARAMETERS failed', async () => {
            mockActionParametersPromise = Promise.reject();
            createComponentUnderTest(defaultNode, { isNewMode: false });
            const eventCallback = jest.fn();
            document.addEventListener(
                ClosePropertyEditorEvent.EVENT_NAME,
                eventCallback
            );
            await ticks(10);

            await mockActionParametersPromise.catch(() => {
                document.removeEventListener(
                    ClosePropertyEditorEvent.EVENT_NAME,
                    eventCallback
                );
                expect(eventCallback).toHaveBeenCalled();
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the action call label', async () => {
            const eventCallback = jest.fn();
            document.addEventListener(
                SetPropertyEditorTitleEvent.EVENT_NAME,
                eventCallback
            );
            createComponentUnderTest(defaultNode, { isNewMode: false });
            await untilNoFailure(() => {
                expect(eventCallback).toHaveBeenCalledTimes(2);
                expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                    'FlowBuilderInvocableActionEditor.editPropertyEditorTitle(chatterPost,FlowBuilderInvocableActionEditor.coreActionTypeLabel)'
                );
                expect(eventCallback.mock.calls[1][0].detail.title).toBe(
                    'FlowBuilderInvocableActionEditor.editPropertyEditorTitle(Post to Chatter,FlowBuilderInvocableActionEditor.coreActionTypeLabel)'
                );
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the action call unique name if we cannot get the action call label', async () => {
            mockActionsPromise = Promise.reject();
            const eventCallback = jest.fn();
            document.addEventListener(
                SetPropertyEditorTitleEvent.EVENT_NAME,
                eventCallback
            );
            createComponentUnderTest(defaultNode, { isNewMode: false });
            await ticks(10);
            expect(eventCallback).toHaveBeenCalledTimes(1);
            expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                'FlowBuilderInvocableActionEditor.editPropertyEditorTitle(chatterPost,FlowBuilderInvocableActionEditor.coreActionTypeLabel)'
            );
        });
    });
    describe('New invocable action node', () => {
        it('should dispatch a CannotRetrieveCalloutParametersEvent if call to GET_INVOCABLE_ACTION_PARAMETERS failed', async () => {
            mockActionParametersPromise = Promise.reject();
            createComponentUnderTest(defaultNode, { isNewMode: true });
            const eventCallback = jest.fn();
            document.addEventListener(
                CannotRetrieveCalloutParametersEvent.EVENT_NAME,
                eventCallback
            );
            await ticks(10);

            await mockActionParametersPromise.catch(() => {
                document.removeEventListener(
                    CannotRetrieveCalloutParametersEvent.EVENT_NAME,
                    eventCallback
                );
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
    describe('invocable action supports automatic output handling', () => {
        let invocableActionEditor;
        beforeEach(() => {
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue(
                'Unsupported'
            );
            invocableActionEditor = createComponentUnderTest(
                actionWithAutomaticOutputNode
            );
        });
        it('Should change storeOutputAutomatically to false if the process type does not support automatic output', () => {
            expect(invocableActionEditor.node.storeOutputAutomatically).toBe(
                false
            );
        });
    });
});
