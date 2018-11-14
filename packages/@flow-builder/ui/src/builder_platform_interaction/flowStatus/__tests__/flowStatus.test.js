import { createElement } from 'lwc';
import FlowStatus from 'builder_platform_interaction/flowStatus';
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from '../flowStatusLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-flow-status', {
        is: FlowStatus
    });

    document.body.appendChild(el);
    return el;
};

const selectors = {
    badge: 'lightning-badge',
};

describe('flowStatus', () => {
    describe('ACTIVE', () => {
        it('correctly sets label', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.ACTIVE;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.label).toEqual(LABELS.activeLabel);
            });
        });
        it('correctly sets title', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.ACTIVE;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.title).toEqual(LABELS.activeTitle);
            });
        });
        it('has class slds-theme_success', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.ACTIVE;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.className).toEqual('slds-theme_success');
            });
        });
    });

    describe('OBSOLETE', () => {
        it('correctly sets label', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.OBSOLETE;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.label).toEqual(LABELS.deactivatedLabel);
            });
        });
        it('correctly sets title', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.OBSOLETE;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.title).toEqual(LABELS.deactivatedTitle);
            });
        });
        it('has class slds-theme_success', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.OBSOLETE;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.className).toEqual('');
            });
        });
    });

    describe('DRAFT', () => {
        it('correctly sets label', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.DRAFT;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.label).toEqual(LABELS.draftLabel);
            });
        });
        it('correctly sets title', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.DRAFT;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.title).toEqual(LABELS.draftTitle);
            });
        });
        it('has class slds-theme_success', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.DRAFT;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.className).toEqual('');
            });
        });
    });

    describe('INVALID DRAFT', () => {
        it('correctly sets label', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.INVALID_DRAFT;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.label).toEqual(LABELS.draftLabel);
            });
        });
        it('correctly sets title', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.INVALID_DRAFT;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.title).toEqual(LABELS.draftTitle);
            });
        });
        it('has class slds-theme_success', () => {
            const component = createComponentUnderTest();
            component.flowStatus = FLOW_STATUS.INVALID_DRAFT;

            return Promise.resolve().then(() => {
                const badge = getShadowRoot(component).querySelector(selectors.badge);
                expect(badge.className).toEqual('');
            });
        });
    });
});
