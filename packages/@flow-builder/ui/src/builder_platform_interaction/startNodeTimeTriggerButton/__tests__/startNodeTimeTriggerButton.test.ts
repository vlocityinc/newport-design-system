// @ts-nocheck
import { createElement } from 'lwc';
import StartNodeTimeTriggerButton from 'builder_platform_interaction/startNodeTimeTriggerButton';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { startElementWithAccountAndNoCondition } from 'mock/storeDataAutolaunched';
import { EDIT_START_TIME_TRIGGERS } from 'builder_platform_interaction/elementConfig';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const setupComponentUnderTest = (startElementObject, flowTriggerType) => {
    const element = createElement('builder_platform_interaction-start-node-time-trigger-button', {
        is: StartNodeTimeTriggerButton
    });
    if (startElementObject) {
        element.node = startElementObject;
    } else if (flowTriggerType) {
        element.node.triggerType = flowTriggerType;
    }

    document.body.appendChild(element);
    return element;
};

const selectors = {
    startTimeTrigger: '.start-time-trigger',
    timeTriggerButtonText: '.start-time-trigger span'
};

const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

describe('Focus Management', () => {
    it('Should fire ArrowKeyDownEvent with the right key on pressing arrow down key', () => {
        const startNodeTimeTriggerButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.BEFORE_SAVE);
        const callback = jest.fn();
        startNodeTimeTriggerButtonEditor.addEventListener(ArrowKeyDownEvent.EVENT_NAME, callback);
        startNodeTimeTriggerButtonEditor.keyboardInteractions.execute('arrowdown');
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.key).toBe('arrowDown');
    });

    it('Should fire ArrowKeyDownEvent with the right key on pressing arrow up key', () => {
        const startNodeTimeTriggerButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.BEFORE_SAVE);
        const callback = jest.fn();
        startNodeTimeTriggerButtonEditor.addEventListener(ArrowKeyDownEvent.EVENT_NAME, callback);
        startNodeTimeTriggerButtonEditor.keyboardInteractions.execute('arrowup');
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.key).toBe('arrowUp');
    });
});

describe('When flow trigger Type is RECORD_CHANGED', () => {
    let startNodeTimeTriggerButtonEditor;
    describe(' non configured time trigger for BEFORE_SAVE', () => {
        beforeEach(() => {
            startNodeTimeTriggerButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.BEFORE_SAVE);
        });
        it('Checks if non configured time trigger button rendered text correctly', () => {
            expect.assertions(1);
            expect(
                runQuerySelector(startNodeTimeTriggerButtonEditor, selectors.timeTriggerButtonText).textContent
            ).toBe('FlowBuilderCanvasElement.startElementSetTimeTrigger');
        });
    });
    describe(' non configured time trigger for BEFORE_DELETE', () => {
        beforeEach(() => {
            startNodeTimeTriggerButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.BEFORE_DELETE);
        });
        it('Checks if non configured time trigger button rendered text correctly', () => {
            expect.assertions(1);
            expect(
                runQuerySelector(startNodeTimeTriggerButtonEditor, selectors.timeTriggerButtonText).textContent
            ).toBe('FlowBuilderCanvasElement.startElementSetTimeTrigger');
        });
    });
    describe(' non configured time trigger for AFTER_SAVE', () => {
        beforeEach(() => {
            startNodeTimeTriggerButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.AFTER_SAVE);
        });
        it('Checks if non configured time trigger button rendered text correctly', () => {
            expect.assertions(1);
            expect(
                runQuerySelector(startNodeTimeTriggerButtonEditor, selectors.timeTriggerButtonText).textContent
            ).toBe('FlowBuilderCanvasElement.startElementSetTimeTrigger');
        });
    });

    it('Checks if an EditElementEvent is dispatched with editStartTimeTriggers mode when Set Time Trigger button is clicked', async () => {
        expect.assertions(2);
        startNodeTimeTriggerButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
        const callback = jest.fn();
        startNodeTimeTriggerButtonEditor.addEventListener(EditElementEvent.EVENT_NAME, callback);
        startNodeTimeTriggerButtonEditor.shadowRoot.querySelector(selectors.startTimeTrigger).click();
        await ticks(1);
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toMatchObject({
            detail: {
                canvasElementGUID: startNodeTimeTriggerButtonEditor.node.guid,
                mode: EDIT_START_TIME_TRIGGERS
            }
        });
    });
});
