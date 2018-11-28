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

jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));
jest.mock('builder_platform_interaction/outputResourcePicker', () => require('builder_platform_interaction_mocks/outputResourcePicker'));

function createComponentForTest(props) {
    let el = createElement('builder_platform_interaction-wait-editor', { is: WaitEditor });
    el = Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const DEFAULT_WAIT_EVENT_ID = 'defaultWaitEvent';

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    WAIT_EVENT: 'builder_platform_interaction-wait-event',
    DEFAULT_PATH: 'builder_platform_interaction-label-description.defaultPath',
    REORDERABLE_NAV: 'builder_platform_interaction-reorderable-vertical-navigation',
};

jest.mock('../waitReducer', () => {
    return {
        waitReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))).mockName('waitReducer'),
    };
});

let noErrorState;
beforeEach(() => {
    noErrorState = {
        name : {value: 'testWaitName', error: null},
        label : {value: 'testWaitLabel', error: null},
        description: 'wait description',
        elementType : 'WAIT',
        guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
        isCanvasElement : true,
        defaultConnectorLabel: { value: 'defaultConnectorLabelValue'},
        locationX : 789,
        locationY : 123,
        waitEvents: [
            {
                guid: 'waitEvent1',
                label: 'wait event label',
                name: 'waitEventName',
                conditions: [],
                conditionLogic: { value: CONDITION_LOGIC.AND, error: null },
                inputParameters: [],
                outputParameters: {},
            }
        ]
    };
});

describe('wait-editor', () => {
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

describe('default path', () => {
    it('handles DefaultPathChangedEvent and updates defaultConnectorLabel', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        // trigger showing of default path
        const reorderableWaitEventNav = getShadowRoot(waitElement).querySelector(selectors.REORDERABLE_NAV);
        reorderableWaitEventNav.dispatchEvent(new CustomEvent('itemselected', {
            detail: { itemId: DEFAULT_WAIT_EVENT_ID }
        }));
        return Promise.resolve().then(() => {
            const defaultPathChangedEvent = new PropertyChangedEvent('defaultConnectorLabel', 'new label', null);
            getShadowRoot(waitElement).querySelector(selectors.DEFAULT_PATH).dispatchEvent(defaultPathChangedEvent);

            const mockCallParams = waitReducer.mock.calls[0];
            const waitReducerEvent = mockCallParams[1];

            expect(mockCallParams[0]).toEqual(noErrorState);
            const expectedReducerEvent = {
                type: 'propertychanged',
                detail: {
                    propertyName: 'defaultConnectorLabel',
                    value: defaultPathChangedEvent.detail.value
                }
            };
            expect(waitReducerEvent.type).toEqual(expectedReducerEvent.type);
            expect(waitReducerEvent.detail.propertyName).toEqual(expectedReducerEvent.detail.propertyName);
            expect(waitReducerEvent.detail.value).toEqual(expectedReducerEvent.detail.value);
        });
    });
    it('initial default path does not have an error', () => {
        const waitElement = createComponentForTest({node: noErrorState});
        return Promise.resolve().then(() => {
            const reorderableWaitEventsNav = getShadowRoot(waitElement).querySelector(selectors.REORDERABLE_NAV);
            const menuItems = reorderableWaitEventsNav.menuItems;
            expect(menuItems[1].hasErrors).toBeFalsy();
        });
    });
    it('default path has an error if there is no label', () => {
        noErrorState.defaultConnectorLabel = {
            value: '',
            error: 'Label should not be empty'
        };
        const waitElement = createComponentForTest({node: noErrorState});
        return Promise.resolve().then(() => {
            const reorderableWaitEventsNav = getShadowRoot(waitElement).querySelector(selectors.REORDERABLE_NAV);
            const menuItems = reorderableWaitEventsNav.menuItems;
            expect(menuItems[1].hasErrors).toBeTruthy();
        });
    });
});
