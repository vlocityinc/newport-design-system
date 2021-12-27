// @ts-nocheck
import { query, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_FREQUENCY } from 'builder_platform_interaction/flowMetadata';
import { createElement } from 'lwc';
import ScheduleTriggerEditor from '../scheduleTriggerEditor';

const SELECTORS = {
    START_DATE_INPUT: 'lightning-input.startDate',
    START_TIME_INPUT: 'lightning-input.startTime',
    FREQUENCY_INPUT: 'lightning-combobox.frequency'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-schedule-trigger-editor', {
        is: ScheduleTriggerEditor
    });

    Object.assign(el, { node });

    setDocumentBodyChildren(el);
    return el;
}

const scheduleElement = () => ({
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    frequency: { value: 'Once', error: null },
    startDate: undefined,
    startTime: undefined
});

describe('schedule-trigger-editor', () => {
    const updateStartDateEvent = new CustomEvent('change', {
        detail: {
            value: 'Jul 25, 2019'
        }
    });
    const updateStartTimeEvent = new CustomEvent('change', {
        detail: {
            value: '11:59 AM'
        }
    });
    const updateFrequencyEvent = new CustomEvent('change', {
        detail: {
            value: FLOW_TRIGGER_FREQUENCY.WEEKLY
        }
    });
    const invalidEvent = new CustomEvent('change', {
        detail: {
            value: ''
        }
    });

    let startElement;
    beforeEach(() => {
        startElement = createComponentForTest(scheduleElement());
    });

    it('handles startDate updates', () => {
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateStartDateEvent);
        expect(startElement.node.startDate.value).toBe('Jul 25, 2019');
    });

    it('handles startTime updates', () => {
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateStartTimeEvent);
        expect(startElement.node.startDate.value).toBe('11:59 AM');
    });

    it('handles frequency updates', () => {
        query(startElement, SELECTORS.FREQUENCY_INPUT).dispatchEvent(updateFrequencyEvent);
        expect(startElement.node.frequency.value).toBe(FLOW_TRIGGER_FREQUENCY.WEEKLY);
    });

    it('handles startDate updates should dispatch an UpdateNodeEvent', async () => {
        const updateNodeCallBack = jest.fn();
        startElement.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateStartDateEvent);
        expect(updateNodeCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: startElement.node }
            })
        );
    });

    it('handles startTime updates should dispatch an UpdateNodeEvent', async () => {
        const updateNodeCallBack = jest.fn();
        startElement.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateStartTimeEvent);
        expect(updateNodeCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: startElement.node }
            })
        );
    });

    it('handles frequency updates should dispatch an UpdateNodeEvent', async () => {
        const updateNodeCallBack = jest.fn();
        startElement.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateFrequencyEvent);
        expect(updateNodeCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: startElement.node }
            })
        );
    });

    it('validates required startDate input', () => {
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(invalidEvent);
        expect(startElement.node.startDate.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });

    it('validates required startTime input', () => {
        query(startElement, SELECTORS.START_TIME_INPUT).dispatchEvent(invalidEvent);
        expect(startElement.node.startTime.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });

    it('validates required frequency input', () => {
        query(startElement, SELECTORS.FREQUENCY_INPUT).dispatchEvent(invalidEvent);
        expect(startElement.node.frequency.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });
});
