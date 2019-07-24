import { createElement } from 'lwc';
import ComponentVisiblity from 'builder_platform_interaction/componentVisibility';
import {
    showPopover,
    hidePopover
} from 'builder_platform_interaction/builderUtils';
import {
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionLogicEvent,
    UpdateConditionEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { conditionListReducer } from 'builder_platform_interaction/conditionListReducer';

jest.mock('builder_platform_interaction/builderUtils');
jest.mock('builder_platform_interaction/conditionListItem', () =>
    require('builder_platform_interaction_mocks/conditionListItem')
);

const NEW_CONDITION = {
    rowIndex: 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e4',
    leftHandSide: { value: '' }
};

const CONDITION = {
    rowIndex: 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e5',
    leftHandSide: { value: 'condition1' }
};

const CONDITION_2 = {
    rowIndex: 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e6',
    leftHandSide: { value: 'condtion2' }
};

const selectors = {
    conditionList: 'builder_platform_interaction-condition-list',
    firstCondition:
        'builder_platform_interaction-row:nth-child(1) div.condition-container'
};

function getVisibilityRule(
    conditionLogic = CONDITION_LOGIC.NO_CONDITIONS,
    conditions = []
) {
    return {
        conditionLogic: { value: conditionLogic },
        conditions
    };
}

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-component-visibility',
        {
            is: ComponentVisiblity
        }
    );

    Object.assign(
        el,
        props || {
            visibilityRule: getVisibilityRule()
        }
    );

    function reducer(event) {
        el.visibilityRule = conditionListReducer(el.visibilityRule, event);
    }

    const events = [
        UpdateConditionLogicEvent.EVENT_NAME,
        AddConditionEvent.EVENT_NAME,
        DeleteConditionEvent.EVENT_NAME,
        UpdateConditionEvent.EVENT_NAME
    ];

    events.map(event => el.addEventListener(event, reducer));

    document.body.appendChild(el);
    return el;
};

function getConditionList(element) {
    return element.shadowRoot.querySelector(selectors.conditionList);
}

describe('Component Visibility', () => {
    it('when click condition, shows popover', () => {
        const element = createComponentUnderTest({
            visibilityRule: getVisibilityRule(CONDITION_LOGIC.AND, [CONDITION])
        });

        const firstCondition = element.shadowRoot.querySelector(
            selectors.firstCondition
        );

        firstCondition.dispatchEvent(
            new Event('click', {
                bubbles: true,
                cancelable: true
            })
        );

        expect(showPopover).toHaveBeenCalled();
        expect(showPopover.mock.calls[0][1]).toMatchObject({
            condition: CONDITION
        });
    });

    describe('when update condition logic', () => {
        it('emits an UpdateConditionLogic event, hides popover', () => {
            const element = createComponentUnderTest({
                visibilityRule: getVisibilityRule(CONDITION_LOGIC.OR, [
                    CONDITION
                ])
            });

            const updateConditionLogicCallback = jest.fn();
            element.addEventListener(
                UpdateConditionLogicEvent.EVENT_NAME,
                updateConditionLogicCallback
            );

            getConditionList(element).dispatchEvent(
                new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.AND)
            );

            expect(updateConditionLogicCallback).toHaveBeenCalled();
            expect(updateConditionLogicCallback.mock.calls[0][0]).toMatchObject(
                {
                    detail: {
                        value: CONDITION_LOGIC.AND
                    }
                }
            );

            expect(hidePopover).toHaveBeenCalled();
        });

        it('from NO_CONDITIONS to AND, adds a new condition and shows the popover for it', () => {
            const element = createComponentUnderTest();

            getConditionList(element).dispatchEvent(
                new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.AND)
            );

            return Promise.resolve().then(() => {
                expect(showPopover).toHaveBeenCalled();
                expect(showPopover.mock.calls[0][1]).toMatchObject({
                    condition: element.visibilityRule.conditions[0]
                });
            });
        });

        it('from AND to NO_CONDITIONS, removes all conditions', () => {
            const element = createComponentUnderTest({
                visibilityRule: getVisibilityRule(CONDITION_LOGIC.OR, [
                    CONDITION,
                    CONDITION_2
                ])
            });

            getConditionList(element).dispatchEvent(
                new PropertyChangedEvent(
                    'conditionLogic',
                    CONDITION_LOGIC.NO_CONDITIONS
                )
            );

            return Promise.resolve().then(() => {
                expect(element.visibilityRule.conditions).toHaveLength(0);
                expect(showPopover).not.toHaveBeenCalled();
            });
        });
    });

    describe('when delete condition', () => {
        it('emits a DeleteConditionEvent and popover is hidden', () => {
            const indexOfItemToDelete = 0;
            const element = createComponentUnderTest({
                visibilityRule: getVisibilityRule(CONDITION_LOGIC.AND, [
                    CONDITION
                ])
            });

            const eventCallback = jest.fn();
            element.addEventListener(
                DeleteConditionEvent.EVENT_NAME,
                eventCallback
            );

            getConditionList(element).dispatchEvent(
                new DeleteConditionEvent(element.guid, indexOfItemToDelete)
            );

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: indexOfItemToDelete
                }
            });

            expect(hidePopover).toHaveBeenCalled();
        });
    });

    describe('when add condition', () => {
        it('emits AddConditionEvent and popover is hidden and then shown again for the new condition', () => {
            const element = createComponentUnderTest({
                visibilityRule: getVisibilityRule(CONDITION_LOGIC.AND, [
                    CONDITION
                ])
            });

            const eventCallback = jest.fn();
            element.addEventListener(
                AddConditionEvent.EVENT_NAME,
                eventCallback
            );

            const addConditionEvent = new AddConditionEvent();
            getConditionList(element).dispatchEvent(addConditionEvent);
            expect(eventCallback).toHaveBeenCalled();
            expect(hidePopover).toHaveBeenCalled();

            // after the reducer has processed the event, and the component got re-rendered
            return Promise.resolve().then(() => {
                expect(showPopover).toHaveBeenCalled();
                expect(element.visibilityRule.conditions).toHaveLength(2);
                expect(showPopover.mock.calls[0][1]).toMatchObject({
                    condition: element.visibilityRule.conditions[1]
                });
            });
        });

        it('noop when last condition isNew: popover is not hidden, no conditions is added', () => {
            const element = createComponentUnderTest({
                visibilityRule: getVisibilityRule(CONDITION_LOGIC.AND, [
                    NEW_CONDITION
                ])
            });

            const eventCallback = jest.fn();
            element.addEventListener(
                AddConditionEvent.EVENT_NAME,
                eventCallback
            );

            const conditionList = element.shadowRoot.querySelector(
                selectors.conditionList
            );

            conditionList.dispatchEvent(new AddConditionEvent());

            expect(eventCallback).not.toHaveBeenCalled();
            expect(hidePopover).not.toHaveBeenCalled();
            return Promise.resolve().then(() => {
                expect(element.visibilityRule.conditions).toHaveLength(1);
            });
        });
    });
});
