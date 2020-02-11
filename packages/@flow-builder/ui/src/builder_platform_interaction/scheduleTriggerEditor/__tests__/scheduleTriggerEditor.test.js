import { createElement } from 'lwc';
import { query } from 'builder_platform_interaction/builderTestUtils';
import ScheduleTriggerEditor from '../scheduleTriggerEditor';
import { FLOW_TRIGGER_FREQUENCY } from 'builder_platform_interaction/flowMetadata';

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

    document.body.appendChild(el);
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
    it('handles startDate updates', () => {
        const startElement = createComponentForTest(scheduleElement());
        const event = new CustomEvent('change', {
            detail: {
                value: 'Jul 25, 2019'
            }
        });
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(event);

        expect(startElement.node.startDate.value).toBe('Jul 25, 2019');
    });

    it('handles startTime updates', () => {
        const startElement = createComponentForTest(scheduleElement());
        const event = new CustomEvent('change', {
            detail: {
                value: '11:59 AM'
            }
        });
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(event);

        expect(startElement.node.startDate.value).toBe('11:59 AM');
    });

    it('handles frequency updates', () => {
        const startElement = createComponentForTest(scheduleElement());
        const event = new CustomEvent('change', {
            detail: {
                value: FLOW_TRIGGER_FREQUENCY.WEEKLY
            }
        });
        query(startElement, SELECTORS.FREQUENCY_INPUT).dispatchEvent(event);

        expect(startElement.node.frequency.value).toBe(FLOW_TRIGGER_FREQUENCY.WEEKLY);
    });

    it('validates required startDate input', () => {
        const startElement = createComponentForTest(scheduleElement());
        const event = new CustomEvent('change', {
            detail: {
                value: ''
            }
        });
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(event);

        expect(startElement.node.startDate.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });

    it('validates required startTime input', () => {
        const startElement = createComponentForTest(scheduleElement());
        const event = new CustomEvent('change', {
            detail: {
                value: ''
            }
        });
        query(startElement, SELECTORS.START_TIME_INPUT).dispatchEvent(event);

        expect(startElement.node.startTime.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });

    it('validates required frequency input', () => {
        const startElement = createComponentForTest(scheduleElement());
        const event = new CustomEvent('change', {
            detail: {
                value: ''
            }
        });
        query(startElement, SELECTORS.FREQUENCY_INPUT).dispatchEvent(event);

        expect(startElement.node.frequency.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });
});
