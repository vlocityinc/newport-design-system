// @ts-nocheck
import { LIGHTNING_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { NewResourceEvent } from 'builder_platform_interaction/events';
import { LABELS } from '../fieldInputMenuLabels';

const tag = 'builder_platform_interaction-field-input-menu';

const createComponentUnderTest = async () => {
    return createComponent(tag);
};

const selectors = {
    container: '.menu-fixed-height',
    footer: '.test-footer',
    footerText: '.test-footer span.slds-p-left_small',
    footerButton: '.test-footer button'
};

jest.mock('builder_platform_interaction/fieldInputMenuViewContainer', () =>
    require('builder_platform_interaction_mocks/fieldInputMenuViewContainer')
);

jest.mock('builder_platform_interaction/fieldInputMenuHeader', () =>
    require('builder_platform_interaction_mocks/fieldInputMenuHeader')
);

describe('Field Input Menu Tests', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest();
    });

    test('sanity', () => {
        expect(cmp).toBeTruthy();
    });

    it('Should have a menu container', () => {
        const container = cmp.shadowRoot.querySelector(selectors.container);
        expect(container).not.toBeNull();
    });

    it('Should have a menu footer', () => {
        const footer = cmp.shadowRoot.querySelector(selectors.footer);
        expect(footer).not.toBeNull();
    });

    it('Should have the correct footer label', () => {
        const footerText = cmp.shadowRoot.querySelector(selectors.footerText);
        expect(footerText.textContent).toBe(LABELS.footerLabel);
    });

    it('Should have a footer add icon', () => {
        const footerAddIcon = cmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON);
        expect(footerAddIcon).not.toBeNull();
    });

    it('Footer add icon should have the right name', () => {
        const footerAddIcon = cmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON);
        expect(footerAddIcon.iconName).toBe('utility:add');
    });

    it('Footer add icon should have the right size', () => {
        const footerAddIcon = cmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON);
        expect(footerAddIcon.size).toBe('x-small');
    });

    it('Footer add icon should have the right alternative text', () => {
        const footerAddIcon = cmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON);
        expect(footerAddIcon.alternativeText).toBe(LABELS.addUtilityLabel);
    });

    it('Should emit addnewresource on footer click', () => {
        const callback = jest.fn(),
            footerButton = cmp.shadowRoot.querySelector(selectors.footerButton);

        cmp.addEventListener(NewResourceEvent.EVENT_NAME, callback);
        footerButton.click();

        expect(callback).toHaveBeenCalled();
    });
});
