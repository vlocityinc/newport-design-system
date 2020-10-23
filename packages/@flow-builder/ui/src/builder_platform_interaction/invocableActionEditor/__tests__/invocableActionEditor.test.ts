// @ts-nocheck
import { createElement } from 'lwc';
import InvocableActionEditor from '../invocableActionEditor';
import { mockActions } from 'mock/calloutData';
import { chatterPostActionDetails as mockActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { logACallActionDetaild as mockActionDetailsNoOutputs } from 'serverData/GetInvocableActionDetails/logACallActionDetails.json';

import {
    ClosePropertyEditorEvent,
    CannotRetrieveCalloutParametersEvent,
    SetPropertyEditorTitleEvent,
    UpdateNodeEvent,
    PropertyChangedEvent,
    UpdateParameterItemEvent,
    DeleteParameterItemEvent,
    UseAdvancedOptionsSelectionChangedEvent,
    ConfigurationEditorChangeEvent,
    ConfigurationEditorPropertyDeleteEvent,
    DynamicTypeMappingChangeEvent
} from 'builder_platform_interaction/events';
import {
    untilNoFailure,
    ticks,
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent
} from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE, FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import { clearInvocableActionCachedParameters } from 'builder_platform_interaction/invocableActionLib';
import {
    getProcessTypeAutomaticOutPutHandlingSupport,
    getProcessTypeTransactionControlledActionsSupport
} from 'builder_platform_interaction/processTypeLib';

jest.mock('builder_platform_interaction/translatorLib', () => ({
    translateUIModelToFlow: jest.fn()
}));

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING: actual.FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn(),
        getProcessTypeTransactionControlledActionsSupport: jest.fn()
    };
});

jest.mock('../invocableActionReducer', () => {
    const actual = jest.requireActual('../invocableActionReducer');
    const events = jest.requireActual('builder_platform_interaction/events');
    return Object.assign({}, actual, {
        invocableActionReducer: (actionCallNode, event) => {
            if (
                event.type === events.ConfigurationEditorPropertyDeleteEvent.EVENT_NAME ||
                event.type === events.ConfigurationEditorChangeEvent.EVENT_NAME ||
                event.type === events.DynamicTypeMappingChangeEvent.EVENT_NAME ||
                event.type === events.ConfigurationEditorTypeMappingChangeEvent.EVENT_NAME
            ) {
                return actionCallNode;
            }
            return actual.invocableActionReducer(actionCallNode, event);
        }
    });
});

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

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
    flowTransactionModel: { value: FLOW_TRANSACTION_MODEL.AUTOMATIC, error: null },
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
    isCanvasElement: true,
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

const actionWithNoOutputNode = {
    actionName: { value: 'sendEmail', error: null },
    actionType: { value: 'sendEmail', error: null },
    description: { value: 'This is a description', error: null },
    elementType: ELEMENT_TYPE.ACTION_CALL,
    guid: '66b95c2c-468d-466b-baaf-5ad964be585e',
    isCanvasElement: true,
    label: { value: 'Send Email', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'Send_Email', error: null },
    storeOutputAutomatically: true,
    inputParameters: [],
    outputParameters: []
};

const createComponentUnderTest = (node, { isNewMode = false } = {}) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    Object.assign(el, { node, isNewMode });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor',
    parameterList: 'builder_platform_interaction-parameter-list',
    advancedSettingsAccordion: 'builder_platform_interaction-use-advanced-settings-accordion',
    transactionControlPicker: 'builder_platform_interaction-transaction-control-picker',
    outputHeader: '.outputHeader',
    parameterItem: 'builder_platform_interaction-parameter-item',
    divOutputs: '.outputs'
};

let mockActionDetailsPromise = Promise.resolve(mockActionDetails);
let mockActionsPromise = Promise.resolve(mockActions);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    return mockActionsPromise;
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_DETAILS:
                    return mockActionDetailsPromise;
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

const getBaseCalloutEditor = (actionEditor) => {
    return actionEditor.shadowRoot.querySelector(selectors.baseCalloutEditor);
};

const getAdvancedSettingsAccordion = (actionEditor) => {
    return actionEditor.shadowRoot.querySelector(selectors.advancedSettingsAccordion);
};

const getParameterList = (baseCalloutEditor) => {
    return baseCalloutEditor.shadowRoot.querySelector(selectors.parameterList);
};

const getOutputsDiv = (parameterList) => parameterList.shadowRoot.querySelector(selectors.divOutputs);
const getOutputHeader = (parameterList) => parameterList.shadowRoot.querySelector(selectors.outputHeader);
const getOutputParameterItems = (parameterList) => {
    return parameterList.shadowRoot.querySelector(selectors.divOutputs).querySelectorAll(selectors.parameterItem);
};

describe('Invocable Action editor', () => {
    beforeEach(() => {
        clearInvocableActionCachedParameters();
    });
    afterEach(() => {
        mockActionDetailsPromise = Promise.resolve(mockActionDetails);
        mockActionsPromise = Promise.resolve(mockActions);
    });
    it('should display a subtitle including the action call label', async () => {
        const actionEditorCmp = createComponentUnderTest(defaultNode);
        const baseCalloutEditorCmp = getBaseCalloutEditor(actionEditorCmp);
        await mockActionsPromise;
        await mockActionDetailsPromise;
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
    it('property changed event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new PropertyChangedEvent('description', 'new desc', null);
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    it('value of flow transaction model should be automatic ', () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        expect(actionEditorCmp.getNode().flowTransactionModel.value).toBe(FLOW_TRANSACTION_MODEL.AUTOMATIC);
    });

    it('property changed event updates the value of flow transactionModel', async () => {
        expect.assertions(2);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new PropertyChangedEvent(
            'flowTransactionModel',
            FLOW_TRANSACTION_MODEL.CURRENT_TRANSACTION,
            null
        );
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
        expect(actionEditorCmp.getNode().flowTransactionModel.value).toBe(FLOW_TRANSACTION_MODEL.CURRENT_TRANSACTION);
    });
    it('update parameter event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);

        const event = new UpdateParameterItemEvent(
            true,
            '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
            'subjectNameOrId',
            '578b0f58-afd1-4ddb-9d7e-fdfe6ab570ff',
            'reference',
            null
        );
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    it('delete parameter event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);

        const event = new DeleteParameterItemEvent(true, '58d8bd82-1977-4cf3-a5a7-f629347fa0e8', 'subjectNameOrId');
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    it('configuration editor input value changed event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);

        const event = new ConfigurationEditorChangeEvent('text');
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    it('configuration editor input value deleted event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);

        const event = new ConfigurationEditorPropertyDeleteEvent('text');
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    it('use advanced options selection change event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new UseAdvancedOptionsSelectionChangedEvent(true);
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    it('dynamic data type mapping change event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        const actionEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        actionEditorCmp.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new DynamicTypeMappingChangeEvent({
            typeName: 'T_inputCollection',
            typeValue: 'CaseSolution',
            error: null,
            rowIndex: 'b5243fc4-38e8-475e-b046-5c1ed74ca8f9'
        });
        getBaseCalloutEditor(actionEditorCmp).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: actionEditorCmp.getNode() }
            })
        );
    });
    describe('Edit existing invocable action', () => {
        it('should dispatch a ClosePropertyEditorEvent if call to GET_INVOCABLE_ACTION_DETAILS failed', async () => {
            mockActionDetailsPromise = Promise.reject();
            createComponentUnderTest(defaultNode, { isNewMode: false });
            const eventCallback = jest.fn();
            document.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
            await ticks(10);

            await mockActionDetailsPromise.catch(() => {
                document.removeEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
                expect(eventCallback).toHaveBeenCalled();
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the action call label', async () => {
            const eventCallback = jest.fn();
            document.addEventListener(SetPropertyEditorTitleEvent.EVENT_NAME, eventCallback);
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
            document.addEventListener(SetPropertyEditorTitleEvent.EVENT_NAME, eventCallback);
            createComponentUnderTest(defaultNode, { isNewMode: false });
            await ticks(10);
            expect(eventCallback).toHaveBeenCalledTimes(1);
            expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                'FlowBuilderInvocableActionEditor.editPropertyEditorTitle(chatterPost,FlowBuilderInvocableActionEditor.coreActionTypeLabel)'
            );
        });
    });
    describe('New invocable action node', () => {
        it('should dispatch a CannotRetrieveCalloutParametersEvent if call to GET_INVOCABLE_ACTION_DETAILS failed', async () => {
            mockActionDetailsPromise = Promise.reject();
            createComponentUnderTest(defaultNode, { isNewMode: true });
            const eventCallback = jest.fn();
            document.addEventListener(CannotRetrieveCalloutParametersEvent.EVENT_NAME, eventCallback);
            await ticks(10);

            await mockActionDetailsPromise.catch(() => {
                document.removeEventListener(CannotRetrieveCalloutParametersEvent.EVENT_NAME, eventCallback);
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
    describe('invocable action supports automatic output handling', () => {
        let invocableActionEditor;
        beforeEach(() => {
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
            invocableActionEditor = createComponentUnderTest(actionWithAutomaticOutputNode);
        });
        it('Should change storeOutputAutomatically to false if the process type does not support automatic output', () => {
            expect(invocableActionEditor.node.storeOutputAutomatically).toBe(false);
        });
    });

    describe('Transaction Controlled Actions and Automatic Output Handling is supported. Action has output parameters', () => {
        let invocableActionEditor, baseCalloutEditor, parameterList;
        beforeEach(() => {
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Supported');
            getProcessTypeTransactionControlledActionsSupport.mockReturnValue(true);
            invocableActionEditor = createComponentUnderTest(actionWithAutomaticOutputNode);
            baseCalloutEditor = getBaseCalloutEditor(invocableActionEditor);
            parameterList = getParameterList(baseCalloutEditor);
        });
        it('show transaction control picker is true', () => {
            const baseCalloutEditorCmp = getBaseCalloutEditor(invocableActionEditor);
            expect(baseCalloutEditorCmp.showTransactionControlPicker).toBe(true);
        });
        it('Should show advanced settings accordion', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            expect(advancedSettingsAccordion).not.toBeNull();
        });
        it('Should display transaction control picker', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            const transactionControlPicker = advancedSettingsAccordion.shadowRoot.querySelector(
                selectors.transactionControlPicker
            );
            expect(transactionControlPicker).not.toBeNull();
        });
        it('Should display the Advanced Checkbox', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            const advancedOptionCheckbox = getAdvancedOptionCheckbox(advancedSettingsAccordion);
            expect(advancedOptionCheckbox).toBeDefined();
            expect(advancedOptionCheckbox.type).toBe('checkbox');
            expect(advancedOptionCheckbox.checked).toBe(false);
        });
        it('Does not display the output div', () => {
            const outputsDiv = getOutputsDiv(parameterList);
            expect(outputsDiv).toBeNull();
        });
    });

    describe('Transaction Controlled Actions are not supported but automatic output handling is supported. Action has outputs', () => {
        let invocableActionEditor, baseCalloutEditor, parameterList;
        beforeEach(() => {
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Supported');
            getProcessTypeTransactionControlledActionsSupport.mockReturnValue(false);
            invocableActionEditor = createComponentUnderTest(actionWithAutomaticOutputNode);
            baseCalloutEditor = getBaseCalloutEditor(invocableActionEditor);
            parameterList = getParameterList(baseCalloutEditor);
        });
        it('show transaction control picker is false', () => {
            const baseCalloutEditorCmp = getBaseCalloutEditor(invocableActionEditor);
            expect(baseCalloutEditorCmp.showTransactionControlPicker).toBe(false);
        });
        it('Should not display transaction control picker', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            const transactionControlPicker = advancedSettingsAccordion.shadowRoot.querySelector(
                selectors.transactionControlPicker
            );
            expect(transactionControlPicker).toBeNull();
        });
        it('Should display the accordion', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            expect(advancedSettingsAccordion).not.toBeNull();
        });
        it('Should display the Advanced Checkbox', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            const advancedOptionCheckbox = getAdvancedOptionCheckbox(advancedSettingsAccordion);
            expect(advancedOptionCheckbox).toBeDefined();
            expect(advancedOptionCheckbox.type).toBe('checkbox');
            expect(advancedOptionCheckbox.checked).toBe(false);
        });
        it('Does not display the output div', () => {
            const outputsDiv = getOutputsDiv(parameterList);
            expect(outputsDiv).toBeNull();
        });
    });

    describe('Transaction Controlled Actions are supported but automatic output handling is not supported. Action has output parameters ', () => {
        let invocableActionEditor, baseCalloutEditor, parameterList;
        beforeEach(() => {
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
            getProcessTypeTransactionControlledActionsSupport.mockReturnValue(true);
            invocableActionEditor = createComponentUnderTest(actionWithAutomaticOutputNode);
            baseCalloutEditor = getBaseCalloutEditor(invocableActionEditor);
            parameterList = getParameterList(baseCalloutEditor);
        });
        it('show transaction control picker is true', () => {
            const baseCalloutEditorCmp = getBaseCalloutEditor(invocableActionEditor);
            expect(baseCalloutEditorCmp.showTransactionControlPicker).toBe(true);
        });
        it('Should display the accordion', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            expect(advancedSettingsAccordion).not.toBeNull();
        });
        it('Should display transaction control picker', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            const transactionControlPicker = advancedSettingsAccordion.shadowRoot.querySelector(
                selectors.transactionControlPicker
            );
            expect(transactionControlPicker).not.toBeNull();
        });
        it('Should not display the Advanced Checkbox Component', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            const advancedOptionComponent = getUseAdvancedOptionComponent(advancedSettingsAccordion);
            expect(advancedOptionComponent).toBeNull();
        });
        it('should contains output div header', () => {
            const outputHeader = getOutputHeader(parameterList);
            expect(outputHeader).not.toBeNull();
        });
        it('contains output parameters in outputs div', () => {
            const parameterItems = getOutputParameterItems(parameterList);
            expect(parameterItems).not.toBeNull();
        });
    });

    describe('Transaction Controlled Actions and automatic output handling are not supported. Action has output parameters ', () => {
        let invocableActionEditor, baseCalloutEditor, parameterList;
        beforeEach(() => {
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
            getProcessTypeTransactionControlledActionsSupport.mockReturnValue(false);
            invocableActionEditor = createComponentUnderTest(actionWithAutomaticOutputNode);
            baseCalloutEditor = getBaseCalloutEditor(invocableActionEditor);
            parameterList = getParameterList(baseCalloutEditor);
        });
        it('show Transaction control picker is false', () => {
            const baseCalloutEditorCmp = getBaseCalloutEditor(invocableActionEditor);
            expect(baseCalloutEditorCmp.showTransactionControlPicker).toBe(false);
        });
        it('Should not display the accordion', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            expect(advancedSettingsAccordion).toBeNull();
        });
        it('should contains output div header', () => {
            const outputHeader = getOutputHeader(parameterList);
            expect(outputHeader).not.toBeNull();
        });
        it('contains output parameters in outputs div', () => {
            const parameterItems = getOutputParameterItems(parameterList);
            expect(parameterItems).not.toBeNull();
        });
    });

    describe('Transaction Controlled Actions and automatic output handling is not supported. No output parameters', () => {
        let invocableActionEditor;
        beforeEach(() => {
            mockActionDetailsPromise = Promise.resolve(mockActionDetailsNoOutputs);
            getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
            getProcessTypeTransactionControlledActionsSupport.mockReturnValue(false);
            invocableActionEditor = createComponentUnderTest(actionWithNoOutputNode);
        });
        it('show Transaction control picker is false', () => {
            const baseCalloutEditorCmp = getBaseCalloutEditor(invocableActionEditor);
            expect(baseCalloutEditorCmp.showTransactionControlPicker).toBe(false);
        });
        it('Should not display the accordion', () => {
            const advancedSettingsAccordion = getAdvancedSettingsAccordion(invocableActionEditor);
            expect(advancedSettingsAccordion).toBeNull();
        });
    });
});
