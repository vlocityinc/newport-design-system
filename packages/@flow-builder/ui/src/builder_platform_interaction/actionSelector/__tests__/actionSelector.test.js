import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import ActionSelector from "../actionSelector";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { ValueChangedEvent, ComboboxStateChangedEvent } from "builder_platform_interaction/events";
import { mockActions, mockApexPlugins, mockSubflows } from "mock/actionSelectorData";

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

jest.mock('builder_platform_interaction-server-data-lib', () => {
    const actual = require.requireActual('builder_platform_interaction-server-data-lib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    return Promise.resolve(mockActions);
                case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                    return Promise.resolve(mockApexPlugins);
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    return Promise.resolve(mockSubflows);
                default:
                    return Promise.reject();
            }
        }
    };
});

describe('Action selector', () => {
    let actionSelectorComponent;
    let lightningCombobox;
    let groupedCombobox;
    let interactionCombobox;
    beforeEach(() => {
        actionSelectorComponent = createComponentUnderTest();
        lightningCombobox = getShadowRoot(actionSelectorComponent).querySelector(selectors.lightningCombobox);
        interactionCombobox = getShadowRoot(actionSelectorComponent).querySelector(selectors.lightningInteractionCombobox);
        groupedCombobox = getShadowRoot(interactionCombobox).querySelector(selectors.lightningGroupedCombobox);
    });
    it('displays all action types', () => {
        expect(lightningCombobox.options.map(option => option.label)).toEqual(
            ['FlowBuilderActionCallEditor.actionTypeOption', 'FlowBuilderActionCallEditor.apexTypeOption',
                'FlowBuilderActionCallEditor.apexPluginTypeOption', 'FlowBuilderActionCallEditor.emailAlertTypeOption',
                'FlowBuilderActionCallEditor.localActionTypeOption', 'FlowBuilderActionCallEditor.subflowTypeOption']);
    });
    describe('By default', () => {
        test('"Action" should be the selected Action type', () => {
            expect(lightningCombobox.value).toBe(ELEMENT_TYPE.ACTION_CALL);
        });
        test('Combobox should contain all ACTION_CALL items', () => {
            expect(groupedCombobox.items.map(item => item.text)).toEqual(['Post to Chatter', 'Send Email']);
        });
        test('Combobox placeholder should be : Find an Action...', () => {
            expect(groupedCombobox.placeholder).toBe('FlowBuilderActionCallEditor.actionComboboxPlaceholder');
        });
        test('Combobox Label should be : Referenced Action', () => {
            expect(groupedCombobox.label).toBe('FlowBuilderActionCallEditor.actionComboboxLabel');
        });
    });
    describe('When action type changes', () => {
        it('should update the items of the second combobox', () => {
            const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}});
            lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
            return Promise.resolve().then(() => {
                expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
            });
        });
        it('should update the Action combobox placeholder', () => {
            const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}});
            lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
            return Promise.resolve().then(() => {
                expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
            });
        });
        it('should update the combobox label', () => {
            const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}});
            lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
            return Promise.resolve().then(() => {
                expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
                expect(groupedCombobox.label).toBe('FlowBuilderActionCallEditor.apexComboboxLabel');
            });
        });
        it('should display no value for the Action combobox', async () => {
            actionSelectorComponent.selectedAction = {
                actionName : 'emailSimple',
                actionType : 'emailSimple',
                elementType : ELEMENT_TYPE.ACTION_CALL
            };
            await Promise.resolve();
            expect(interactionCombobox.value.displayText).toBe('emailSimple-emailSimple');
            lightningCombobox.dispatchEvent(new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}}));
            await Promise.resolve();
            expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
            expect(interactionCombobox.value).toBe('');
        });
    });
    describe('When an action is selected', () => {
        const cbEventItem = { value: 'emailSimple-emailSimple', displayText: 'emailSimple-emailSimple' };

        it('should fire ValueChangedEvent', () => {
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            interactionCombobox.dispatchEvent(new ComboboxStateChangedEvent(cbEventItem));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.value).toMatchObject({actionName: 'emailSimple', actionType: 'emailSimple'});
        });
        it('api should return the selected element', () => {
            interactionCombobox.dispatchEvent(new ComboboxStateChangedEvent(cbEventItem));
            expect(actionSelectorComponent.selectedAction).toMatchObject({actionName: 'emailSimple', actionType: 'emailSimple'});
        });
    });
    describe('When selecting an element type using the api', () => {
        beforeEach(() => {
            actionSelectorComponent.selectedAction = {
                elementType : ELEMENT_TYPE.APEX_PLUGIN_CALL
            };
        });
        it('should display the corresponding type label in the type combobox', () => {
            expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_PLUGIN_CALL);
        });
        it('should display no value in the Action combobox', () => {
            expect(interactionCombobox.value).toBe('');
        });
    });
    describe('When selecting an action using the api', () => {
        beforeEach(() => {
            actionSelectorComponent.selectedAction = {
                actionName : 'emailSimple',
                actionType : 'emailSimple',
                elementType : ELEMENT_TYPE.ACTION_CALL
            };
        });
        it('should display the corresponding type label in the type combobox', () => {
            expect(lightningCombobox.value).toBe(ELEMENT_TYPE.ACTION_CALL);
        });
        it('should display the corresponding action label in the Action combobox', () => {
            // TODO : fix once we display the label
            expect(interactionCombobox.value.displayText).toBe('emailSimple-emailSimple');
        });
    });
});