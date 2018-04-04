import { createElement } from 'engine';
import ActionSelector from '../action-selector';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { mockActions, mockApexPlugins, mockSubflows } from 'mock-action-selector-data';

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

jest.mock('builder_platform_interaction-actioncall-lib', () => ({
    getAllInvocableActionsForType : jest.fn((callback) => callback(mockActions)),
    getApexPlugins : jest.fn((callback) => callback(mockApexPlugins)),
    getSubflows : jest.fn((callback) => callback(mockSubflows))
}));

describe('Action selector', () => {
    let actionSelectorComponent;
    let lightningCombobox;
    let groupedCombobox;
    let interactionCombobox;
    beforeEach(() => {
        actionSelectorComponent = createComponentUnderTest();
        lightningCombobox = actionSelectorComponent.querySelector(selectors.lightningCombobox);
        groupedCombobox = actionSelectorComponent.querySelector(selectors.lightningGroupedCombobox);
        interactionCombobox = actionSelectorComponent.querySelector(selectors.lightningInteractionCombobox);
    });
    it('does not display action types without action instances', () => {
        // No elements for "Email Alert"
        expect(lightningCombobox.options.map(option => option.label)).toEqual(["Action", "Apex", "Apex Plugin", "Subflow"]);
    });
    describe('By default', () => {
        test('"Action" should be the selected Action type', () => {
            expect(lightningCombobox.value).toBe(ELEMENT_TYPE.ACTION_CALL);
        });
        test('Other Action Type should be available', () => {
            expect(groupedCombobox.items[0].items.map(item => item.text)).toEqual(["Post to Chatter", "Send Email"]);
        });
        test('Combobox placeholder should be : Find an Action...', () => {
            expect(groupedCombobox.placeholder).toBe("Find an Action...");
        });
        test('Combobox Label should be : Referenced Action', () => {
            expect(groupedCombobox.label).toBe("Referenced Action");
        });
    });
    describe('When action type changes', () => {
        it('should update the items of the second combobox', () => {
            const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}});
            lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
            return Promise.resolve().then(() => {
                expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
                expect(groupedCombobox.items[0].items.map(item => item.text)).toEqual(["Apex1", "Apex2", "Apex3"]);
            });
        });
        it('should update the Action combobox placeholder', () => {
            const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}});
            lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
            return Promise.resolve().then(() => {
                expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
                expect(groupedCombobox.placeholder).toBe("Find an Apex Class...");
            });
        });
        it('should update the combobox label', () => {
            const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}});
            lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
            return Promise.resolve().then(() => {
                expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
                expect(groupedCombobox.label).toBe("Referenced Apex");
            });
        });
        it('should display no value for the Action combobox', async () => {
            actionSelectorComponent.selectedAction = {
                actionName : 'emailSimple',
                actionType : 'emailSimple',
                elementType : ELEMENT_TYPE.ACTION_CALL
            };
            await Promise.resolve();
            expect(interactionCombobox.value).toBe('emailSimple-emailSimple');
            lightningCombobox.dispatchEvent(new CustomEvent('change', {detail: {value: ELEMENT_TYPE.APEX_CALL}}));
            await Promise.resolve();
            expect(lightningCombobox.value).toBe(ELEMENT_TYPE.APEX_CALL);
            expect(interactionCombobox.value).toBe('');
        });
    });
    describe('When an action is selected', () => {
        it('should fire ValueChangedEvent', () => {
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            interactionCombobox.dispatchEvent(new ValueChangedEvent('emailSimple-emailSimple'));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.value).toMatchObject({actionName: "emailSimple", actionType: "emailSimple"});
        });
        it('api should return the selected element', () => {
            interactionCombobox.dispatchEvent(new ValueChangedEvent('emailSimple-emailSimple'));
            expect(actionSelectorComponent.selectedAction).toMatchObject({actionName: "emailSimple", actionType: "emailSimple"});
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
            expect(interactionCombobox.value).toBe('emailSimple-emailSimple');
        });
    });
});