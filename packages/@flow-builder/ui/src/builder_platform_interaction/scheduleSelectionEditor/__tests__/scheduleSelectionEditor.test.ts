import { query, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import {
    RepeatScheduleFrequencyChangedEvent,
    UpdateNodeEvent,
    VisualPickerListChangedEvent
} from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_FREQUENCY } from 'builder_platform_interaction/flowMetadata';
import { createElement } from 'lwc';
import scheduleSelectionEditor, { JOURNEY_SCHEDULE_TYPE } from '../scheduleSelectionEditor';

const SELECTORS = {
    START_DATE_INPUT: 'lightning-input.start-date',
    START_TIME_INPUT: 'lightning-input.start-time',
    SCHEDULE_TYPE: 'builder_platform_interaction-visual-picker-list',
    REPEAT_SCHEDULE: 'builder_platform_interaction-repeat-schedule'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-schedule-selection-editor', {
        is: scheduleSelectionEditor
    });

    Object.assign(el, { node });

    setDocumentBodyChildren(el);
    return el;
}

const scheduleElement = (frequency) => ({
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    frequency: { value: frequency, error: null },
    startDate: undefined,
    startTime: undefined
});

describe('schedule-selection-editor', () => {
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
    const updateScheduleTypeEvent = new VisualPickerListChangedEvent([
        {
            key: JOURNEY_SCHEDULE_TYPE.RUN_ONCE,
            isSelected: true
        }
    ]);
    const updateRepeatScheduleEvent = new RepeatScheduleFrequencyChangedEvent('Weekly');
    const invalidEvent = new CustomEvent('change', {
        detail: {
            value: ''
        }
    });

    const invalidFrequencyChangeEvent = new RepeatScheduleFrequencyChangedEvent('');

    let startElement;
    beforeEach(() => {
        startElement = createComponentForTest(scheduleElement(FLOW_TRIGGER_FREQUENCY.DAILY));
    });

    it('handles startDate updates', () => {
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateStartDateEvent);
        expect(startElement.node.startDate.value).toBe('Jul 25, 2019');
    });

    it('handles startTime updates', () => {
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(updateStartTimeEvent);
        expect(startElement.node.startDate.value).toBe('11:59 AM');
    });

    it('handles schedule type updates', () => {
        query(startElement, SELECTORS.SCHEDULE_TYPE).dispatchEvent(updateScheduleTypeEvent);
        expect(startElement.node.frequency.value).toBe(FLOW_TRIGGER_FREQUENCY.ONCE);
    });

    it('handles frequency updates', () => {
        query(startElement, SELECTORS.REPEAT_SCHEDULE).dispatchEvent(updateRepeatScheduleEvent);
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

    it('handles schedule type updates should dispatch an UpdateNodeEvent', async () => {
        const updateNodeCallBack = jest.fn();
        startElement.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
        query(startElement, SELECTORS.SCHEDULE_TYPE).dispatchEvent(updateScheduleTypeEvent);
        expect(updateNodeCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: startElement.node }
            })
        );
    });

    it('handles repeat shcdule updates should dispatch an UpdateNodeEvent', async () => {
        const updateNodeCallBack = jest.fn();
        startElement.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
        query(startElement, SELECTORS.REPEAT_SCHEDULE).dispatchEvent(updateRepeatScheduleEvent);
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
        const repeatSchedule = query(startElement, SELECTORS.REPEAT_SCHEDULE);
        repeatSchedule.dispatchEvent(invalidFrequencyChangeEvent);
        expect(startElement.node.frequency.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });
});
