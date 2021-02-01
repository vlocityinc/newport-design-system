// @ts-nocheck
import { createElement } from 'lwc';
import ActionSelector from '../actionSelector';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ValueChangedEvent, ComboboxStateChangedEvent, ActionsLoadedEvent } from 'builder_platform_interaction/events';
import { mockActions, mockApexPlugins, mockSubflows } from 'mock/calloutData';
import { LABELS } from '../actionSelectorLabels';
import { ticks, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock(
    '@salesforce/label/FlowBuilderActionSelector.categoryComboboxPlaceholder',
    () => {
        return { default: 'Search {0} actions...' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderActionSelector.allInvocableActions',
    () => {
        return { default: 'All' };
    },
    { virtual: true }
);

const ALL_ACTIONS_LABELS = mockActions.map((mockAction) => mockAction.label);
const SYSTEM_ACTIONS_LABELS = mockActions
    .filter((mockAction) => mockAction.category === 'System')
    .map((mockAction) => mockAction.label);

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-action-selector', {
        is: ActionSelector
    });
    setDocumentBodyChildren(el);
    return el;
};

const mockError = [
    {
        message: 'Event fired' // 'This is the message currently returned when an error occurs ...'
    }
];

let mockActionsPromise = Promise.resolve(mockActions);
let mockApexPluginsPromise = Promise.resolve(mockApexPlugins);
let mockSubflowsPromise = Promise.resolve(mockSubflows);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    return mockActionsPromise;
                case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                    return mockApexPluginsPromise;
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    return mockSubflowsPromise;
                default:
                    return Promise.reject().catch(() => {});
            }
        }
    };
});

describe('Action selector', () => {
    let actionSelectorComponent;
    const interactionCombobox = () =>
        actionSelectorComponent.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX);
    const groupedCombobox = () =>
        interactionCombobox().shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
    beforeAll(() => {
        Store.setMockState({
            properties: {
                processType: 'flow',
                definitionId: '300xx000000bpCbAAI'
            },
            elements: {}
        });
    });
    afterAll(() => {
        Store.resetStore();
    });
    afterEach(() => {
        mockActionsPromise = Promise.resolve(mockActions).catch(() => {});
        mockApexPluginsPromise = Promise.resolve(mockApexPlugins).catch(() => {});
        mockSubflowsPromise = Promise.resolve(mockSubflows).catch(() => {});
    });
    describe('By default', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            actionSelectorComponent.invocableActionsFetched = true;
        });
        test('Combobox should contain all ACTION_CALL items : standard actions, quick actions and local actions', () => {
            const standardActionText = 'Post to Chatter';
            const quickActionText = 'Add Member';
            const localActionText = 'successLocalAction';
            expect(groupedCombobox().items.map((item) => item.text)).toEqual(
                expect.arrayContaining([standardActionText, quickActionText, localActionText])
            );
        });
        test('Combobox placeholder should be : Search all actions...', () => {
            expect(groupedCombobox().placeholder).toBe('Search all actions...');
        });
    });

    describe('When action list is resolved', () => {
        let actionsChangedEventCallback;
        const expectActionsChangedEventCallbackCalledWithElementType = (elementType, numberActions) => {
            expect(actionsChangedEventCallback).toHaveBeenCalled();
            expect(actionsChangedEventCallback.mock.calls[1][0].detail).toEqual({
                value: { elementType },
                number: numberActions
            });
        };
        beforeEach(() => {
            mockApexPluginsPromise = Promise.resolve([]).catch(() => {});
            actionSelectorComponent = createComponentUnderTest();
            actionsChangedEventCallback = jest.fn();
            document.addEventListener(ActionsLoadedEvent.EVENT_NAME, actionsChangedEventCallback);
        });
        afterEach(() => {
            document.removeEventListener(ActionsLoadedEvent.EVENT_NAME, actionsChangedEventCallback);
        });
        it('should fire ActionsChangedEvent when actions are updated', async () => {
            const expectedNumber = 0;
            actionSelectorComponent.selectedFilterBy = LABELS.filterByTypeOption;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL };
            interactionCombobox().dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: ELEMENT_TYPE.APEX_PLUGIN_CALL,
                        number: expectedNumber
                    }
                })
            );
            expectActionsChangedEventCallbackCalledWithElementType(ELEMENT_TYPE.APEX_PLUGIN_CALL, expectedNumber);
        });
    });
    describe('When action type is subflow', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            actionSelectorComponent.invocableActionsFetched = true;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.SUBFLOW };
        });
        it('should set combobox items to subflows (and ignore filter and category)', () => {
            expect(groupedCombobox().items.map((item) => item.text)).toEqual([
                'CFD - Update elements with different config',
                'LFB Sample 01',
                'LFB Sample - Huge Flow',
                'my subflow'
            ]);
        });
        it('should display "Search flows..." as placeholder', async () => {
            expect(groupedCombobox().placeholder).toBe('FlowBuilderActionSelector.subflowComboboxPlaceholder');
        });
    });
    describe('When action type changes', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            actionSelectorComponent.invocableActionsFetched = true;
            actionSelectorComponent.selectedAction = {};
        });
        it('should update the items of the combobox', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByTypeOption;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.APEX_CALL };
            await Promise.resolve();
            expect(groupedCombobox().items.map((item) => item.text)).toEqual(['Action Test']);
        });
        it('should update the combobox placeholder', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByTypeOption;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.APEX_CALL };
            await Promise.resolve();
            expect(groupedCombobox().placeholder).toBe('FlowBuilderActionSelector.apexComboboxPlaceholder');
        });
        it('should display no value for the combobox', async () => {
            actionSelectorComponent.selectedAction = {
                actionName: 'emailSimple',
                actionType: 'emailSimple',
                elementType: ELEMENT_TYPE.ACTION_CALL
            };
            await Promise.resolve();
            expect(interactionCombobox().value.displayText).toBe('Send Email');
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.APEX_CALL
            };
            await Promise.resolve();
            expect(interactionCombobox().value).toBe('');
        });
        it('api should return the selected element', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.APEX_CALL
            };
            expect(actionSelectorComponent.selectedAction).toEqual({
                elementType: ELEMENT_TYPE.APEX_CALL
            });
        });
        it('should display label', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByTypeOption;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.APEX_CALL };
            await Promise.resolve();
            expect(groupedCombobox().label).toBe('FlowBuilderActionSelector.actionSearchInputLabel');
        });
        it('should display overridden label if provided', async () => {
            actionSelectorComponent.labelOverride = 'foo';
            actionSelectorComponent.selectedFilterBy = LABELS.filterByTypeOption;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.APEX_CALL };
            await ticks();
            expect(groupedCombobox().label).toBe(actionSelectorComponent.labelOverride);
        });
    });
    describe('When action category changes', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            actionSelectorComponent.invocableActionsFetched = true;
            actionSelectorComponent.selectedAction = {};
        });
        it('should update the items of the combobox', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'System';
            await Promise.resolve();
            expect(groupedCombobox().items.map((item) => item.text)).toEqual(SYSTEM_ACTIONS_LABELS);
        });
        it('should update the combobox placeholder', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'System';
            await Promise.resolve();
            expect(groupedCombobox().placeholder).toBe('Search system actions...');
        });
        it('should set all available action as combobox items when null', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = null;
            await Promise.resolve();
            expect(groupedCombobox().items.map((item) => item.text)).toEqual(ALL_ACTIONS_LABELS);
        });
        it('should set combobox placeholder to Search all actions if none selected', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = null;
            await Promise.resolve();
            expect(groupedCombobox().placeholder).toBe('Search all actions...');
        });
        it('should set all available action as combobox items when All', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'All';
            await Promise.resolve();
            expect(groupedCombobox().items.map((item) => item.text)).toEqual(ALL_ACTIONS_LABELS);
        });
        it('should set combobox placeholder to Search all actions if All', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'All';
            await Promise.resolve();
            expect(groupedCombobox().placeholder).toBe('Search all actions...');
        });
        it('should show up capitalized category name in placeholder for external services', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'BankServiceNew';
            await Promise.resolve();
            expect(groupedCombobox().placeholder).toBe('Search BankServiceNew actions...');
        });
        it('should show up lower case category name in placeholder for uncategorized', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'Uncategorized';
            await Promise.resolve();
            expect(groupedCombobox().placeholder).toBe('Search uncategorized actions...');
        });
        it('should display label', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByCategoryOption;
            actionSelectorComponent.selectedCategory = 'Uncategorized';
            await Promise.resolve();
            expect(groupedCombobox().label).toBe('FlowBuilderActionSelector.actionSearchInputLabel');
        });
    });
    describe('When there are no actions for a given action type', () => {
        beforeEach(() => {
            mockApexPluginsPromise = Promise.resolve([]).catch(() => {});
            actionSelectorComponent = createComponentUnderTest();
        });
        it('the combobox should be disabled', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL
            };
            await Promise.resolve();
            expect(interactionCombobox().disabled).toBe(true);
        });
    });
    describe('When error occurs when retrieving data from server', () => {
        beforeEach(() => {
            mockApexPluginsPromise = Promise.reject(mockError).catch(() => {});
            mockActionsPromise = Promise.reject(mockError).catch(() => {});
            mockSubflowsPromise = Promise.reject(mockError).catch(() => {});
            actionSelectorComponent = createComponentUnderTest();
        });
        test('Combobox should be disabled', () => {
            expect(interactionCombobox().disabled).toBe(true);
        });
    });
    describe('When the user selects or type something in the combobox', () => {
        const dispatchActionChangeEvent = async (actionDurableId, displayText = null, error = null) => {
            const item = actionDurableId ? { value: actionDurableId } : null;
            interactionCombobox().dispatchEvent(new ComboboxStateChangedEvent(item, displayText, error));
            await Promise.resolve();
        };
        let eventCallback;
        const expectEventCallbackCalledWithValue = (value) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.value).toEqual(value);
        };
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
        });
        afterEach(() => {
            document.removeEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
        });
        it('should fire ValueChangedEvent with action name and action type when a standard invocable action is selected', async () => {
            dispatchActionChangeEvent('emailSimple-emailSimple');
            expectEventCallbackCalledWithValue({
                actionName: 'emailSimple',
                actionType: 'emailSimple',
                elementType: ELEMENT_TYPE.ACTION_CALL
            });
        });
        it('should fire ValueChangedEvent with action name and action type when quick action is selected', async () => {
            dispatchActionChangeEvent('quickAction-CollaborationGroup.mynamespace__NewGroupMember');
            expectEventCallbackCalledWithValue({
                actionName: 'CollaborationGroup.mynamespace__NewGroupMember',
                actionType: 'quickAction',
                elementType: ELEMENT_TYPE.ACTION_CALL
            });
        });
        it('should fire ValueChangedEvent with action name and action type when an apex action is selected', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.APEX_CALL
            };
            dispatchActionChangeEvent('apex-mynamespace__ActionTest');
            expectEventCallbackCalledWithValue({
                actionName: 'mynamespace__ActionTest',
                actionType: 'apex',
                elementType: ELEMENT_TYPE.APEX_CALL
            });
        });
        it('should fire ValueChangedEvent with action name and action type when an apex plugin is selected', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL
            };
            dispatchActionChangeEvent('mynamespace__lookUpAccountPlugin');
            expectEventCallbackCalledWithValue({
                apexClass: 'mynamespace__lookUpAccountPlugin',
                elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL
            });
        });
        it('should fire ValueChangedEvent with action name and action type when an email alert is selected', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.EMAIL_ALERT
            };
            dispatchActionChangeEvent(
                'emailAlert-mynamespace__img_src_http_foo_bar_foo_jpg__c.mynamespace__My_Email_Alert'
            );
            expectEventCallbackCalledWithValue({
                actionName: 'mynamespace__img_src_http_foo_bar_foo_jpg__c.mynamespace__My_Email_Alert',
                actionType: 'emailAlert',
                elementType: ELEMENT_TYPE.EMAIL_ALERT
            });
        });
        it('should fire ValueChangedEvent with action name and action type, and element type when an email alert is selected and selected type is "Action Call"', async () => {
            dispatchActionChangeEvent(
                'emailAlert-mynamespace__img_src_http_foo_bar_foo_jpg__c.mynamespace__My_Email_Alert'
            );
            expectEventCallbackCalledWithValue({
                actionName: 'mynamespace__img_src_http_foo_bar_foo_jpg__c.mynamespace__My_Email_Alert',
                actionType: 'emailAlert',
                elementType: ELEMENT_TYPE.EMAIL_ALERT
            });
        });
        it('should fire ValueChangedEvent with flowName when a subflow is selected', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.SUBFLOW
            };
            dispatchActionChangeEvent('mynamespace__LFB_Sample_01');
            expectEventCallbackCalledWithValue({
                flowName: 'mynamespace__LFB_Sample_01',
                elementType: ELEMENT_TYPE.SUBFLOW
            });
        });
        it('should not fire ValueChangedEvent if this was already the selected action', async () => {
            actionSelectorComponent.selectedAction = {
                actionName: 'emailSimple',
                actionType: 'emailSimple',
                elementType: ELEMENT_TYPE.ACTION_CALL
            };
            await Promise.resolve();
            dispatchActionChangeEvent('emailSimple-emailSimple');
            expect(eventCallback).not.toHaveBeenCalled();
        });
        it('should fire ValueChangedEvent with just the elementType and an error when user types text that does not match an action', async () => {
            dispatchActionChangeEvent(null, 'not an existing action');
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                error: 'FlowBuilderCombobox.genericErrorMessage',
                value: { elementType: ELEMENT_TYPE.ACTION_CALL }
            });
        });
        it('should fire ValueChangedEvent with just the elementType and an error when user focus out with no action selected', async () => {
            dispatchActionChangeEvent(null, '');
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                error: 'FlowBuilderValidation.cannotBeBlank',
                value: { elementType: ELEMENT_TYPE.ACTION_CALL }
            });
        });
        it('should remove errors after they are corrected', async () => {
            // set an error
            dispatchActionChangeEvent(null, '');
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                error: 'FlowBuilderValidation.cannotBeBlank',
                value: { elementType: ELEMENT_TYPE.ACTION_CALL }
            });
            // fiddle with the event listener to get it to rest
            document.removeEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            // now remove it
            dispatchActionChangeEvent('emailSimple-emailSimple');
            expectEventCallbackCalledWithValue({
                actionName: 'emailSimple',
                actionType: 'emailSimple',
                elementType: ELEMENT_TYPE.ACTION_CALL
            });
        });
    });
    describe('When action changes', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            actionSelectorComponent.selectedAction = {
                actionName: 'emailSimple',
                actionType: 'emailSimple',
                elementType: ELEMENT_TYPE.ACTION_CALL
            };
        });
        it('should display the corresponding action label in the Action combobox', async () => {
            expect(interactionCombobox().value.displayText).toBe('Send Email');
        });
    });
    describe('Action subtext', () => {
        const groupedComboboxItemWithValue = (value) =>
            groupedCombobox().items.find((option) => option.value === value);
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.invocableActions = mockActions;
            actionSelectorComponent.invocableActionsFetched = true;
        });
        it('should be "{UniqueName}" for global quick actions', async () => {
            await ticks(1);
            const item = groupedComboboxItemWithValue('quickAction-mynamespace__LogACall');
            expect(item.subText).toBe('quickAction-mynamespace__LogACall');
        });
        it('should be "{Uniquename}" for object quick actions', async () => {
            await ticks(1);
            const item = groupedComboboxItemWithValue('quickAction-Case.mynamespace__LogACall');
            expect(item.subText).toBe('quickAction-Case.mynamespace__LogACall');
        });
        it('should be "{Unique Name}" for subflows', async () => {
            actionSelectorComponent.selectedAction = {
                elementType: ELEMENT_TYPE.SUBFLOW
            };
            await ticks(1);
            const item = groupedComboboxItemWithValue('mynamespace__LFB_Sample_Huge_Flow');
            expect(item.subText).toBe('mynamespace__LFB_Sample_Huge_Flow');
        });
        it('should be "{Unique Name}" for apex plugins', async () => {
            actionSelectorComponent.selectedFilterBy = LABELS.filterByTypeOption;
            actionSelectorComponent.selectedAction = { elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL };
            await ticks(1);
            const item = groupedComboboxItemWithValue('mynamespace__lookUpAccountPlugin');
            expect(item.subText).toBe('mynamespace__lookUpAccountPlugin');
        });
    });
    describe('Pill', () => {
        it('does not support pill', async () => {
            actionSelectorComponent = createComponentUnderTest();
            const combobox = interactionCombobox();
            expect(combobox.isPillSupported).toBe(false);
            expect(combobox.pill).toBeNull();
        });
    });
});
