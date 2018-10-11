import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import ActionSelector from "../actionSelector";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { ValueChangedEvent, ComboboxStateChangedEvent } from "builder_platform_interaction/events";
import { mockActions, mockApexPlugins, mockSubflows } from "mock/calloutData";

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-action-selector', { is: ActionSelector });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningCombobox: 'lightning-combobox',
    lightningGroupedCombobox: 'lightning-grouped-combobox',
    lightningInteractionCombobox: 'builder_platform_interaction-combobox'
};

const mockError = [{
    message:"Event fired" // 'This is the message currently returned when an error occurs ...'
}];

let mockActionsPromise = Promise.resolve(mockActions);
let mockApexPluginsPromise = Promise.resolve(mockApexPlugins);
let mockSubflowsPromise = Promise.resolve(mockSubflows);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    return mockActionsPromise;
                case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                    return mockApexPluginsPromise;
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    return mockSubflowsPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

describe('Action selector', () => {
    let actionSelectorComponent;
    const lightningCombobox = () => getShadowRoot(actionSelectorComponent).querySelector(selectors.lightningCombobox);
    const interactionCombobox = () => getShadowRoot(actionSelectorComponent).querySelector(selectors.lightningInteractionCombobox);
    const groupedCombobox = () => getShadowRoot(interactionCombobox()).querySelector(selectors.lightningGroupedCombobox);
    const dispatchActionTypeChangeEvent = (elementType) => {
        lightningCombobox().dispatchEvent(new CustomEvent('change', {detail: {value: elementType}}));
    };
    const dispatchActionChangeEvent = async (actionDurableId, displayText = null, error = null) => {
        const item = actionDurableId ? { value : actionDurableId } : null;
        interactionCombobox().dispatchEvent(new ComboboxStateChangedEvent(item, displayText, error));
        await Promise.resolve();
    };
    afterEach(() => {
        mockActionsPromise = Promise.resolve(mockActions);
        mockApexPluginsPromise = Promise.resolve(mockApexPlugins);
        mockSubflowsPromise = Promise.resolve(mockSubflows);
    });
    it('displays all action types', () => {
        actionSelectorComponent = createComponentUnderTest();
        expect(lightningCombobox().options.map(option => option.label)).toEqual(
            ['FlowBuilderActionCallEditor.actionTypeOption', 'FlowBuilderActionCallEditor.apexTypeOption',
                'FlowBuilderActionCallEditor.apexPluginTypeOption', 'FlowBuilderActionCallEditor.emailAlertTypeOption',
                'FlowBuilderActionCallEditor.subflowTypeOption']);
    });
    describe('By default', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        test('"Action" should be the selected Action type', () => {
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.ACTION_CALL);
        });
        test('Combobox should contain all ACTION_CALL items : standard actions, quick actions and local actions', () => {
            const standardActionText = 'Post to Chatter';
            const quickActionText = 'Add Member';
            const localActionText = 'successLocalAction';
            expect(groupedCombobox().items.map(item => item.text)).toEqual(expect.arrayContaining([standardActionText, quickActionText, localActionText]));
        });
        test('Combobox placeholder should be : Find an Action...', () => {
            expect(groupedCombobox().placeholder).toBe('FlowBuilderActionCallEditor.actionComboboxPlaceholder');
        });
        test('Combobox Label should be : Referenced Action', () => {
            expect(groupedCombobox().label).toBe('FlowBuilderActionCallEditor.actionComboboxLabel');
        });
    });
    describe('When action type changes', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        it('should update the items of the second combobox', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.APEX_CALL);
            expect(groupedCombobox().items.map(item => item.text)).toEqual(['Action Test']);
        });
        it('should update the Action combobox placeholder', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.APEX_CALL);
            expect(groupedCombobox().placeholder).toBe('FlowBuilderActionCallEditor.apexComboboxPlaceholder');
        });
        it('should update the combobox label', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.APEX_CALL);
            expect(groupedCombobox().label).toBe('FlowBuilderActionCallEditor.apexComboboxLabel');
        });
        it('should display no value for the Action combobox', async () => {
            actionSelectorComponent.selectedAction = {
                actionName : 'emailSimple',
                actionType : 'emailSimple',
                elementType : ELEMENT_TYPE.ACTION_CALL
            };
            await Promise.resolve();
            expect(interactionCombobox().value.displayText).toBe('Send Email');
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.APEX_CALL);
            expect(interactionCombobox().value).toBe('');
        });
        it('should fire ValueChangedEvent', async () => {
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.value).toEqual({'elementType': 'APEX_CALL'});
        });
        it('api should return the selected element', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            expect(actionSelectorComponent.selectedAction).toEqual({'elementType': 'APEX_CALL'});
        });
    });
    describe('When there are no actions for a given action type', () => {
        beforeEach(() => {
            mockApexPluginsPromise = Promise.resolve([]);
            actionSelectorComponent = createComponentUnderTest();
        });
        it('the second combobox should be disabled', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            expect(interactionCombobox().disabled).toBe(true);
        });
    });
    describe('When error occurs when retrieving data from server', () => {
        beforeEach(() => {
            mockApexPluginsPromise = Promise.reject(mockError);
            mockActionsPromise = Promise.reject(mockError);
            mockSubflowsPromise = Promise.reject(mockError);
            actionSelectorComponent = createComponentUnderTest();
        });
        test('Second combobox should be disabled', () => {
            expect(interactionCombobox().disabled).toBe(true);
        });
    });
    describe('When an action is selected', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        it('should fire ValueChangedEvent', () => {
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            dispatchActionChangeEvent('emailSimple-emailSimple');
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.value).toEqual({actionName: 'emailSimple', actionType: 'emailSimple', 'elementType': 'ACTION_CALL'});
        });
        it('api should return the selected element', () => {
            dispatchActionChangeEvent('emailSimple-emailSimple');
            expect(actionSelectorComponent.selectedAction).toEqual({actionName: 'emailSimple', actionType: 'emailSimple', 'elementType': 'ACTION_CALL'});
        });
        it('should not fire ValueChangedEvent if this was already the selected action', () => {
            dispatchActionChangeEvent('emailSimple-emailSimple');
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            dispatchActionChangeEvent('emailSimple-emailSimple');
            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
    describe('When we type text that does not match an action', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        it('should fire ValueChangedEvent with just the elementType', () => {
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            dispatchActionChangeEvent(null, 'not an existing action');
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.value).toEqual({'elementType': 'ACTION_CALL'});
        });
    });
    describe('Selected element', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        it('should contain the action name and action type when a standard invocable action is selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.ACTION_CALL);
            dispatchActionChangeEvent('activateSessionPermSet-activateSessionPermSet');
            expect(actionSelectorComponent.selectedAction).toEqual({actionName: 'activateSessionPermSet', actionType: 'activateSessionPermSet', 'elementType': 'ACTION_CALL'});
        });
        it('should contain the action name and action type when quick action is selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.ACTION_CALL);
            dispatchActionChangeEvent('quickAction-CollaborationGroup.mynamespace__NewGroupMember');
            expect(actionSelectorComponent.selectedAction).toEqual({actionName: 'CollaborationGroup.mynamespace__NewGroupMember', actionType: 'quickAction', 'elementType': 'ACTION_CALL'});
        });
        it('should contain the action name and action type when an apex action is selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_CALL);
            dispatchActionChangeEvent('apex-mynamespace__ActionTest');
            expect(actionSelectorComponent.selectedAction).toEqual({actionName: 'mynamespace__ActionTest', actionType: 'apex', 'elementType': 'APEX_CALL'});
        });
        it('should contain the apex class when an apex plugin is selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            dispatchActionChangeEvent('mynamespace__lookUpAccountPlugin');
            expect(actionSelectorComponent.selectedAction).toEqual({apexClass: 'mynamespace__lookUpAccountPlugin', 'elementType': 'APEX_PLUGIN_CALL'});
        });
        it('should contain the action name and action type when an email alert is selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.EMAIL_ALERT);
            dispatchActionChangeEvent('emailAlert-mynamespace__img_src_http_foo_bar_foo_jpg__c.mynamespace__My_Email_Alert');
            expect(actionSelectorComponent.selectedAction).toEqual({actionName: 'mynamespace__img_src_http_foo_bar_foo_jpg__c.mynamespace__My_Email_Alert', actionType: 'emailAlert', 'elementType': 'EMAIL_ALERT'});
        });
        it('should contain the flowName when a subflow is selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.SUBFLOW);
            dispatchActionChangeEvent('mynamespace__LFB_Sample_01');
            expect(actionSelectorComponent.selectedAction).toEqual({flowName: 'mynamespace__LFB_Sample_01', 'elementType': 'SUBFLOW'});
        });
        it('should only contain the actionType if no action has been selected', () => {
            dispatchActionTypeChangeEvent(ELEMENT_TYPE.SUBFLOW);
            expect(actionSelectorComponent.selectedAction).toEqual({ 'elementType': 'SUBFLOW'});
        });
    });
    describe('When selecting an element type using the api', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        beforeEach(() => {
            actionSelectorComponent.selectedAction = {
                elementType : ELEMENT_TYPE.APEX_PLUGIN_CALL
            };
        });
        it('should display the corresponding type label in the type combobox', () => {
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.APEX_PLUGIN_CALL);
        });
        it('should display no value in the Action combobox', () => {
            expect(interactionCombobox().value).toBe('');
        });
    });
    describe('When selecting an action using the api', () => {
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
            actionSelectorComponent.selectedAction = {
                actionName : 'emailSimple',
                actionType : 'emailSimple',
                elementType : ELEMENT_TYPE.ACTION_CALL
            };
        });
        it('should display the corresponding type label in the type combobox', () => {
            expect(lightningCombobox().value).toBe(ELEMENT_TYPE.ACTION_CALL);
        });
        it('should display the corresponding action label in the Action combobox', () => {
            expect(interactionCombobox().value.displayText).toBe('Send Email');
        });
    });
    describe('Action subtext', () => {
        const groupedComboboxItemWithValue = value => groupedCombobox().items.find(option => option.value === value);
        beforeEach(() => {
            actionSelectorComponent = createComponentUnderTest();
        });
        it('should be "Global - {Description}" for global quick actions', () => {
            return Promise.resolve().then(() => {
                const item = groupedComboboxItemWithValue('quickAction-mynamespace__LogACall');
                expect(item.subText).toBe('FlowBuilderActionCallEditor.globalQuickActionSubTextPrefix');
            });
        });
        it('should be "{Object} - {Description}" for object quick actions', () => {
            return Promise.resolve().then(() => {
                const item = groupedComboboxItemWithValue('quickAction-Case.mynamespace__LogACall');
                expect(item.subText).toBe('Case');
            });
        });
        it('should be "{Unique Name} - {Description}" for subflows', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.SUBFLOW);
            return Promise.resolve().then(() => {
                const item = groupedComboboxItemWithValue('mynamespace__LFB_Sample_Huge_Flow');
                expect(item.subText).toBe('mynamespace__LFB_Sample_Huge_Flow');
            });
        });
        it('should be "{Description}" for apex plugins', async () => {
            await dispatchActionTypeChangeEvent(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            return Promise.resolve().then(() => {
                const item = groupedComboboxItemWithValue('mynamespace__lookUpAccountPlugin');
                expect(item.subText).toBe('Code copied from https://help.salesforce.com/articleView?id=vpm_designer_elements_apex.htm');
            });
        });
    });
});