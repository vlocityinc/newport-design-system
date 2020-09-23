// @ts-nocheck
import { createElement } from 'lwc';
import StartNodeTimeTriggerButton from 'builder_platform_interaction/startNodeTimeTriggerButton';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

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
});
