import {createElement} from 'lwc';
import WaitEvent from "builder_platform_interaction/waitEvent";
import { DeleteWaitEventEvent } from "builder_platform_interaction/events";
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from "../waitEventLabels";

const waitEventWithOneConditional = {
    label: {value: 'Test Name of the Outcome'},
    name: {value: 'Test Dev Name'},
    guid: {value: '123'},
    conditionLogic: {value: '1'},
    conditions: [
        {name: 'condition1', rowIndex: 0}
    ]
};

const selectors = {
    conditionList: 'builder_platform_interaction-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
    removeButton: 'lightning-button.removeWaitEvent',
};

const createComponentUnderTest = (waitEvent) => {
    const el = createElement('builder_platform_interaction-wait-event', {
        is: WaitEvent
    });

    el.waitEvent = waitEvent;
    el.showDelete = true;

    document.body.appendChild(el);


    return el;
};

describe('Wait Event', () => {
    describe('header section', () => {
        it('has name and api name component', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);

            return Promise.resolve().then(() => {
                const labelAndNameComponents = getShadowRoot(element).querySelectorAll(selectors.labelAndName);
                expect(labelAndNameComponents).toHaveLength(1);
                expect(labelAndNameComponents[0].devName.value).toBe(waitEventWithOneConditional.name.value);
                expect(labelAndNameComponents[0].label.value).toBe(waitEventWithOneConditional.label.value);
            });
        });
        it('has Remove button if show delete is true', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);

            return Promise.resolve().then(() => {
                const removeButton = getShadowRoot(element).querySelectorAll(selectors.removeButton)[0];

                expect(removeButton.label).toBe(LABELS.deleteWaitEventLabel);
                expect(removeButton.title).toBe(LABELS.deleteWaitEventLabel);
            });
        });
        it('has no Remove button if show delete is false', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);
            element.showDelete = false;

            return Promise.resolve().then(() => {
                const removeButton = getShadowRoot(element).querySelector(selectors.removeButton);

                expect(removeButton).toBeNull();
            });
        });
    });

    describe('handleDelete', () => {
        it('fires deleteWaitEventEvent with wait event GUID', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteWaitEventEvent.EVENT_NAME, eventCallback);

                const removeButton = getShadowRoot(element).querySelector(selectors.button);
                removeButton.click();

                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        guid: element.waitEvent.guid
                    }
                });
            });
        });
    });
});