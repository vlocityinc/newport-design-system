import { createElement } from 'lwc';

import {
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_FREQUENCY
} from 'builder_platform_interaction/flowMetadata';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { query } from 'builder_platform_interaction/builderTestUtils';

import StartEditor from '../startEditor';

const SELECTORS = {
    SECHEDULE_SECTION: '.scheduleSection',
    TRIGGER_TYPE_INPUT: 'lightning-combobox.triggerType',
    START_DATE_INPUT: 'lightning-input.startDate',
    START_TIME_INPUT: 'lightning-input.startTime',
    FREQUENCY_INPUT: 'lightning-combobox.frequency'
};

const node = {
    elementType: 'START_ELEMENT'
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-start-editor', {
        is: StartEditor
    });

    el.node = Object.assign(deepCopy(node), props);

    document.body.appendChild(el);
    return el;
}

describe('start-editor', () => {
    it('when triggerType is not set, schedule section is not displayed', () => {
        const startElement = createComponentForTest();
        expect(startElement.node.triggerType).toBeFalsy();
        const scheduleSection = query(
            startElement,
            SELECTORS.SECHEDULE_SECTION
        );
        expect(scheduleSection).toBeFalsy();
    });

    it('when triggerType is scheduled, schedule section is displayed', () => {
        const startElement = createComponentForTest({
            triggerType: { value: FLOW_TRIGGER_TYPE.SCHEDULED }
        });
        expect(startElement.node.triggerType.value).toBe(
            FLOW_TRIGGER_TYPE.SCHEDULED
        );
        const scheduleSection = query(
            startElement,
            SELECTORS.SECHEDULE_SECTION
        );
        expect(scheduleSection).toBeTruthy();
    });

    it('handles triggerType updates', () => {
        const startElement = createComponentForTest();
        const event = new CustomEvent('change', {
            detail: {
                value: FLOW_TRIGGER_TYPE.SCHEDULED
            }
        });
        query(startElement, SELECTORS.TRIGGER_TYPE_INPUT).dispatchEvent(event);

        expect(startElement.node.triggerType.value).toBe(
            FLOW_TRIGGER_TYPE.SCHEDULED
        );
    });

    it('handles startDate updates', () => {
        const startElement = createComponentForTest({
            triggerType: { value: FLOW_TRIGGER_TYPE.SCHEDULED }
        });
        const event = new CustomEvent('change', {
            detail: {
                value: 'Jul 25, 2019'
            }
        });
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(event);

        expect(startElement.node.startDate.value).toBe('Jul 25, 2019');
    });

    it('handles startTime updates', () => {
        const startElement = createComponentForTest({
            triggerType: { value: FLOW_TRIGGER_TYPE.SCHEDULED }
        });
        const event = new CustomEvent('change', {
            detail: {
                value: '11:59 AM'
            }
        });
        query(startElement, SELECTORS.START_DATE_INPUT).dispatchEvent(event);

        expect(startElement.node.startDate.value).toBe('11:59 AM');
    });

    it('handles frequency updates', () => {
        const startElement = createComponentForTest({
            triggerType: { value: FLOW_TRIGGER_TYPE.SCHEDULED }
        });
        const event = new CustomEvent('change', {
            detail: {
                value: FLOW_TRIGGER_FREQUENCY.WEEKLY
            }
        });
        query(startElement, SELECTORS.FREQUENCY_INPUT).dispatchEvent(event);

        expect(startElement.node.frequency.value).toBe(
            FLOW_TRIGGER_FREQUENCY.WEEKLY
        );
    });
});
