import { createElement } from 'lwc';
import FlowStatus from 'builder_platform_interaction/flowStatus';
import { LABELS } from '../flowStatusLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-flow-status', {
        is: FlowStatus
    });

    document.body.appendChild(el);
    return el;
};

const selectors = {
    badge: 'lightning-badge'
};

describe('flowStatus', () => {
    describe('ACTIVE', () => {
        it('correctly sets label', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.ACTIVE;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.label).toEqual(LABELS.activeLabel);
        });
        it('correctly sets title', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.ACTIVE;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.title).toEqual(LABELS.activeTitle);
        });
        it('has class slds-theme_success', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.ACTIVE;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.className).toEqual('slds-theme_success');
        });
    });

    describe('OBSOLETE', () => {
        it('correctly sets label', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.OBSOLETE;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.label).toEqual(LABELS.deactivatedLabel);
        });
        it('correctly sets title', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.OBSOLETE;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.title).toEqual(LABELS.deactivatedTitle);
        });
        it('has class slds-theme_success', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.OBSOLETE;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.className).toEqual('');
        });
    });

    describe('DRAFT', () => {
        it('correctly sets label', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.DRAFT;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.label).toEqual(LABELS.draftLabel);
        });
        it('correctly sets title', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.DRAFT;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.title).toEqual(LABELS.draftTitle);
        });
        it('has class slds-theme_success', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.DRAFT;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.className).toEqual('');
        });
    });

    describe('INVALID DRAFT', () => {
        it('correctly sets label', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.INVALID_DRAFT;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.label).toEqual(LABELS.draftLabel);
        });
        it('correctly sets title', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.INVALID_DRAFT;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.title).toEqual(LABELS.draftTitle);
        });
        it('has class slds-theme_success', async () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.INVALID_DRAFT;

            await ticks(1);
            const badge = component.shadowRoot.querySelector(selectors.badge);
            expect(badge.className).toEqual('');
        });
    });
});
