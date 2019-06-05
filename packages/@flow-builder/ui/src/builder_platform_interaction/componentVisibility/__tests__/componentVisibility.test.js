import {createElement} from 'lwc';
import ComponentVisiblity from "builder_platform_interaction/componentVisibility";
import { showPopover, hidePopover } from 'builder_platform_interaction/builderUtils';
import {
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionLogicEvent,
    PropertyChangedEvent
} from "builder_platform_interaction/events";
import { CONDITION_LOGIC } from "builder_platform_interaction/flowMetadata";

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
       showPopover: jest.fn().mockName('showPopover'),
       hidePopover: jest.fn().mockName('hidePopover'),
    };
});

const NEW_CONDITION = {
    rowIndex: 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e4',
    leftHandSide: { value: ''}
};

const CONDITION = {
    rowIndex: 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e5',
    leftHandSide: { value: 'xyz'}
};

const selectors = {
    conditionList: 'builder_platform_interaction-condition-list',
    firstCondition: 'builder_platform_interaction-row:nth-child(1) div.condition-container'
};

function getVisibility(conditionLogic = CONDITION_LOGIC.NO_CONDITIONS, conditions = []) {
    return {
        conditionLogic: { value: conditionLogic },
        conditions
    };
}

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-component-visibility', {
        is: ComponentVisiblity
    });

    Object.assign(el, props || {
        visibility: getVisibility()
    });

    document.body.appendChild(el);
    return el;
};

describe('Component Visibility', () => {
    it('shows popover when new condition', () => {
        createComponentUnderTest({
            visibility: getVisibility(CONDITION_LOGIC.AND, [NEW_CONDITION])
        });

        expect(showPopover).toHaveBeenCalled();
    });

    it('doesnt show popover when condition is not new', () => {
        createComponentUnderTest({
            visibility: getVisibility(CONDITION_LOGIC.AND, [CONDITION])
        });

        expect(showPopover).not.toHaveBeenCalled();
    });

    it('shows popover when click condition', () => {
        const element = createComponentUnderTest({
            visibility: getVisibility(CONDITION_LOGIC.AND, [CONDITION])
        });

        const firstCondition = element.shadowRoot.querySelector(selectors.firstCondition);
        firstCondition.dispatchEvent(new Event('click', {
            'bubbles'   : true,
            'cancelable': true,
        }));

        expect(showPopover).toHaveBeenCalled();
    });

    describe('update condition logic', () => {
        it('when switching to AND and no conditions are present, should emit AddCondition and UpdateConditionLogic events', () => {
            const element = createComponentUnderTest();

            const updateConditionLogicCallback = jest.fn();
            element.addEventListener(UpdateConditionLogicEvent.EVENT_NAME, updateConditionLogicCallback);

            const addConditionCallback = jest.fn();
            element.addEventListener(UpdateConditionLogicEvent.EVENT_NAME, addConditionCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new PropertyChangedEvent('conditionlogic', CONDITION_LOGIC.AND));

            expect(updateConditionLogicCallback).toHaveBeenCalled();
            expect(updateConditionLogicCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    value: CONDITION_LOGIC.AND
                }
            });

            expect(addConditionCallback).toHaveBeenCalled();
        });

        it('when switching to NO_CONDITIONS, should emit an UpdateConditionLogic event', () => {
            const element = createComponentUnderTest({
                visibility: getVisibility(CONDITION_LOGIC.AND)
            });

            const updateConditionLogicCallback = jest.fn();
            element.addEventListener(UpdateConditionLogicEvent.EVENT_NAME, updateConditionLogicCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new PropertyChangedEvent('conditionlogic', CONDITION_LOGIC.NO_CONDITIONS));

            expect(updateConditionLogicCallback).toHaveBeenCalled();
            expect(updateConditionLogicCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    value: CONDITION_LOGIC.NO_CONDITIONS
                }
            });
        });
    });

    describe('delete condition', () => {
        it('should emit a DeleteConditionEvent', () => {
            const element = createComponentUnderTest({
                visibility: getVisibility(CONDITION_LOGIC.AND, [CONDITION, NEW_CONDITION])
            });

            const eventCallback = jest.fn();
            element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new DeleteConditionEvent(element.guid, 0));

           // expect(element.hidePopover).toHaveBeenCalled();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: 0
                }
            });

            expect(hidePopover).toHaveBeenCalled();
        });

        it('when no conditions left, should change condition logic to NO_CONDITIONS', () => {
            const element = createComponentUnderTest({
                visibility: getVisibility(CONDITION_LOGIC.AND, [CONDITION])
            });

            const deleteConditionCallback = jest.fn();
            element.addEventListener(DeleteConditionEvent.EVENT_NAME, deleteConditionCallback);

            const updateConditionLogicCallback = jest.fn();
            element.addEventListener(UpdateConditionLogicEvent.EVENT_NAME, updateConditionLogicCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new DeleteConditionEvent(element.guid, 0));

            expect(deleteConditionCallback).toHaveBeenCalled();
            expect(updateConditionLogicCallback).toHaveBeenCalled();

            expect(hidePopover).toHaveBeenCalled();
        });
    });

    describe('add condition', () => {
        it('should emit an add condition event', () => {
            const element = createComponentUnderTest();

            const eventCallback = jest.fn();
            element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);

            conditionList.dispatchEvent(new AddConditionEvent());
            expect(eventCallback).toHaveBeenCalled();

            expect(hidePopover).toHaveBeenCalled();
        });

        it('noop when last condition isNew', () => {
            const element = createComponentUnderTest({
                visibility: getVisibility(CONDITION_LOGIC.AND, [NEW_CONDITION])
            });

            const eventCallback = jest.fn();
            element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);

            conditionList.dispatchEvent(new AddConditionEvent());

            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
});
