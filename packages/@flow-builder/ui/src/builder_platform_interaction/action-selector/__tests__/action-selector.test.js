import { createElement } from 'engine';
import ActionSelector from '../action-selector';
import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import { ValueChangedEvent } from 'builder_platform_interaction-events';


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

const mockactions = [{
    Description:"Post to the feed for a specific record, user, or Chatter group.",
    DurableId:"chatterPost-chatterPost",
    IsStandard:true,
    Label:"Post to Chatter",
    Name:"chatterPost",
    Type:"chatterPost",
    sobjectType:"InvocableAction"
}, {
    Description:"Send an email where you specify the subject, body, and recipients.",
    DurableId:"emailSimple-emailSimple",
    IsStandard:true,
    Label:"Send Email",
    Name:"emailSimple",
    Type:"emailSimple",
    sobjectType:"InvocableAction"
}, {
    Name:"apexAction1",
    DurableId:"apexAction1",
    IsStandard: false,
    Type: "apex",
    Description: "This is an apex action 1",
    Label: "Apex1"
}, {
    Name:"apexAction2",
    DurableId:"apexAction2",
    IsStandard: false,
    Type: "apex",
    Description: "This is an apex action 2",
    Label: "Apex2"
}, {
    Name:"apexAction3",
    DurableId:"apexAction3",
    IsStandard: false,
    Type: "apex",
    Description: "This is an apex action 3",
    Label: "Apex3"
}];

jest.mock('builder_platform_interaction-actioncall-lib', () => ({
    getAllInvocableActionsForType : jest.fn((callback) => callback(mockactions)),
    getApexPlugins : jest.fn((callback) => callback([]))
}));

describe('Action selector Tests', () => {
    let actionSelectorComponent;
    beforeEach(() => {
        actionSelectorComponent = createComponentUnderTest();
    });
    it('By default "Action" should be the selected Action type', () => {
        const lightningCombobox = actionSelectorComponent.querySelector(selectors.lightningCombobox);
        const groupedCombobox = actionSelectorComponent.querySelector(selectors.lightningGroupedCombobox);
        expect(lightningCombobox.value).toBe(ELEMENT_TYPE.ACTION_CALL);
        expect(groupedCombobox.items.map(item => item.text)).toEqual(["Post to Chatter", "Send Email"]);
    });
    it('Change selected value on the first combobox and check the value of the second combobox', () => {
        const lightningCBChangeEventForApex = new CustomEvent('change', {detail: {value: 'apex'}});
        const lightningCombobox = actionSelectorComponent.querySelector(selectors.lightningCombobox);
        lightningCombobox.dispatchEvent(lightningCBChangeEventForApex);
        return Promise.resolve().then(() => {
            expect(lightningCombobox.value).toBe("apex");
            const groupedCombobox = actionSelectorComponent.querySelector(selectors.lightningGroupedCombobox);
            expect(groupedCombobox.items.map(item => item.text)).toEqual(["Apex1", "Apex2", "Apex3"]);
        });
    });
    it('ValueChangedEvent is fired when an action is selected ', () => {
        const interactionCombobox = actionSelectorComponent.querySelector(selectors.lightningInteractionCombobox);
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            document.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            interactionCombobox.dispatchEvent(new ValueChangedEvent('emailSimple-emailSimple'));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({value: {actionName: "emailSimple", actionType: "emailSimple"}});
        });
    });
});