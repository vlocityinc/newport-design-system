import { createElement } from 'lwc';
import WaitEditor from "../waitEditor";
import {
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    PropertyChangedEvent,
    WaitEventPropertyChangedEvent,
    WaitEventParameterChangedEvent,
} from 'builder_platform_interaction/events';
import { getShadowRoot } from 'lwc-test-utils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { waitReducer } from '../waitReducer';

function createComponentForTest(props) {
    let el = createElement('builder_platform_interaction-wait-editor', { is: WaitEditor });
    el = Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    WAIT_EVENT: 'builder_platform_interaction-wait-event',
};

jest.mock('../waitReducer', () => {
    return {
        waitReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))).mockName('waitReducer'),
    };
});

describe('wait-editor', () => {
    let noErrorState;
    beforeEach(() => {
        noErrorState = {
            name : {value: 'testWaitName', error: null},
            label : {value: 'testWaitLabel', error: null},
            description: 'wait description',
            elementType : 'WAIT',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement : true,
            locationX : 789,
            locationY : 123,
            waitEvents: [
                {
                    guid: 'waitEvent1',
                    label: 'wait event label',
                    name: 'waitEventName',
                    conditions: [],
                    conditionLogic: { value: CONDITION_LOGIC.AND, error: null },
                }
            ]
        };
    });
    it('handles the property changed event and updates the property', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        const event = new PropertyChangedEvent('description', 'new desc', null);
        getShadowRoot(waitElement).querySelector(selectors.LABEL_DESCRIPTION).dispatchEvent(event);
        return Promise.resolve().then(() => {
            expect(waitReducer).toHaveBeenCalledWith(waitElement.node, event);
        });
    });

    it('handles AddConditionEvent from waitEvent', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        const event = new AddConditionEvent();
        getShadowRoot(waitElement).querySelector(selectors.WAIT_EVENT).dispatchEvent(event);
        return Promise.resolve().then(() => {
            expect(waitReducer).toHaveBeenCalledWith(waitElement.node, event);
        });
    });

    it('handles UpdateConditionEvent from waitEvent', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        const event = new UpdateConditionEvent();
        getShadowRoot(waitElement).querySelector(selectors.WAIT_EVENT).dispatchEvent(event);
        return Promise.resolve().then(() => {
            expect(waitReducer).toHaveBeenCalledWith(waitElement.node, event);
        });
    });

    it('handles DeleteConditionEvent from waitEvent', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        const event = new DeleteConditionEvent();
        getShadowRoot(waitElement).querySelector(selectors.WAIT_EVENT).dispatchEvent(event);
        return Promise.resolve().then(() => {
            expect(waitReducer).toHaveBeenCalledWith(waitElement.node, event);
        });
    });

    it('handles WaitEventPropertyChangedEvent from waitEvent', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        const event = new WaitEventPropertyChangedEvent();
        getShadowRoot(waitElement).querySelector(selectors.WAIT_EVENT).dispatchEvent(event);
        return Promise.resolve().then(() => {
            expect(waitReducer).toHaveBeenCalledWith(waitElement.node, event);
        });
    });

    it('handles WaitEventParameterChangedEvent from waitEvent', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        const event = new WaitEventParameterChangedEvent();
        getShadowRoot(waitElement).querySelector(selectors.WAIT_EVENT).dispatchEvent(event);
        return Promise.resolve().then(() => {
            expect(waitReducer).toHaveBeenCalledWith(waitElement.node, event);
        });
    });
});