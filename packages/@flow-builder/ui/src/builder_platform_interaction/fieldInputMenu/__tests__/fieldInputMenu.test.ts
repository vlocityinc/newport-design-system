// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { NewResourceEvent } from 'builder_platform_interaction/events';
import { LABELS } from '../fieldInputMenuLabels';

const createComponentUnderTest = async () => {
    return createComponent(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_MENU);
};

const selectors = {
    container: '.menu-fixed-height',
    footer: '.test-footer',
    footerText: '.test-footer span.slds-p-left_small',
    footerButton: '.test-footer button'
};

describe('Field Input Menu Tests', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
    });

    test('sanity', () => {
        expect(cmp).toBeTruthy();
    });

    it('Should have a menu container', () => {
        const container = cmp.shadowRoot.querySelector(selectors.container);
        expect(container).not.toBeNull();
    });

    it('Should have a menu section', () => {
        const section = cmp.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_MENU_SECTION);
        expect(section).not.toBeNull();
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
